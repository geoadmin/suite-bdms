﻿using BDMS.Authentication;
using BDMS.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Net;
using System.Security.Claims;

namespace BDMS.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class UploadController : ControllerBase
{
    private readonly BdmsContext context;
    private readonly ILogger logger;
    private readonly LocationService locationService;
    private readonly CoordinateService coordinateService;
    private readonly int sridLv95 = 2056;
    private readonly int sridLv03 = 21781;

    public UploadController(BdmsContext context, ILogger<UploadController> logger, LocationService locationService, CoordinateService coordinateService)
    {
        this.context = context;
        this.logger = logger;
        this.locationService = locationService;
        this.coordinateService = coordinateService;
    }

    /// <summary>
    /// Receives an uploaded csv file to import one or several <see cref="Borehole"/>(s).
    /// </summary>
    /// <param name="workgroupId">The <see cref="Workgroup.Id"/> of the new <see cref="Borehole"/>(s).</param>
    /// <param name="file">The <see cref="IFormFile"/> containing the csv records that were uploaded.</param>
    /// <returns>The number of the newly created <see cref="Borehole"/>s.</returns>
    [HttpPost]
    [Authorize(Policy = PolicyNames.Viewer)]
    public async Task<ActionResult<int>> UploadFileAsync(int workgroupId, IFormFile file)
    {
        logger.LogInformation("Import borehole(s) to workgroup with id <{WorkgroupId}>", workgroupId);
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var boreholes = ReadBoreholesFromCsv(file)
                .Select(importBorehole =>
                {
                    var borehole = (Borehole)importBorehole;

                    // Set DateTime kind to UTC, since PSQL type 'timestamp with timezone' requires UTC as DateTime.Kind
                    borehole.SpudDate = borehole.SpudDate != null ? DateTime.SpecifyKind(borehole.SpudDate.Value, DateTimeKind.Utc) : null;
                    borehole.DrillingDate = borehole.DrillingDate != null ? DateTime.SpecifyKind(borehole.DrillingDate.Value, DateTimeKind.Utc) : null;
                    borehole.RestrictionUntil = borehole.RestrictionUntil != null ? DateTime.SpecifyKind(borehole.RestrictionUntil.Value, DateTimeKind.Utc) : null;
                    borehole.WorkgroupId = workgroupId;

                    // Detect coordinate reference system and set according coordinate properties of borehole.
                    if (importBorehole.Location_x != null && importBorehole.Location_y != null)
                    {
                        if (importBorehole.Location_x >= 2_000_000)
                        {
                            borehole.OriginalReferenceSystem = ReferenceSystem.LV95;
                            borehole.LocationX = importBorehole.Location_x;
                            borehole.LocationY = importBorehole.Location_y;
                        }
                        else
                        {
                            borehole.OriginalReferenceSystem = ReferenceSystem.LV03;
                            borehole.LocationXLV03 = importBorehole.Location_x;
                            borehole.LocationYLV03 = importBorehole.Location_y;
                        }
                    }

                    return borehole;
                })
                .ToList();

            ValidateBoreholes(boreholes);
            if (!ModelState.IsValid)
            {
                return ValidationProblem(statusCode: (int)HttpStatusCode.BadRequest);
            }

            var userName = HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

            var user = await context.Users
                .AsNoTracking()
                .SingleOrDefaultAsync(u => u.Name == userName)
                .ConfigureAwait(false);

            foreach (var borehole in boreholes)
            {
                // Compute borehole location.
                await UpdateBoreholeLocationAndCoordinates(borehole).ConfigureAwait(false);

                // Add a workflow per borehole.
                borehole.Workflows.Add(
                    new Workflow
                    {
                        UserId = user.Id,
                        Role = Role.Editor,
                        Started = DateTime.Now.ToUniversalTime(),
                        Finished = null,
                    });
            }

            await context.Boreholes.AddRangeAsync(boreholes).ConfigureAwait(false);
            return await SaveChangesAsync(() => Ok(boreholes.Count)).ConfigureAwait(false);
        }
        catch (Exception ex) when (ex is HeaderValidationException || ex is ReaderException)
        {
            return Problem(ex.Message, statusCode: (int)HttpStatusCode.BadRequest);
        }
        catch (Exception ex)
        {
            logger.LogError("Error while importing borehole(s) to workgroup with id <{WorkgroupId}>: <{Error}>", workgroupId, ex);
            return Problem("Error while importing borehole(s).");
        }
    }

    private void ValidateBoreholes(List<Borehole> boreholes)
    {
        foreach (var borehole in boreholes.Select((value, index) => (value, index)))
        {
            if (string.IsNullOrEmpty(borehole.value.OriginalName))
            {
                ModelState.AddModelError($"Row{borehole.index}", "Field 'original_name' is invalid.");
            }

            if (borehole.value.LocationX == null && borehole.value.LocationXLV03 == null)
            {
                ModelState.AddModelError($"Row{borehole.index}", "Field 'location_x' is invalid.");
            }

            if (borehole.value.LocationY == null && borehole.value.LocationYLV03 == null)
            {
                ModelState.AddModelError($"Row{borehole.index}", "Field 'location_y' is invalid.");
            }

            // Check if borehole with same coordinates and same total depth is provided multiple times.
            var duplicatedBoreholeInFile = boreholes
                .Where((b, i) => i != borehole.index)
                .FirstOrDefault(b =>
                    CompareValuesWithTolerance(b.TotalDepth, borehole.value.TotalDepth, 0) &&
                    CompareValuesWithTolerance(b.LocationX, borehole.value.LocationX, 2) &&
                    CompareValuesWithTolerance(b.LocationY, borehole.value.LocationY, 2));

            if (duplicatedBoreholeInFile != null)
            {
                ModelState.AddModelError($"Row{borehole.index}", $"Borehole with same Coordinates (+/- 2m) and same {nameof(Borehole.TotalDepth)} is provied multiple times.");
            }

            // Check if borehole with same coordinates and same total depth already exists in database.
            var duplicatedBoreholeInDb = context.Boreholes
                .FirstOrDefault(x =>

                    // Check if TotalDepth values are both null or equal with no tolerance
                    ((x.TotalDepth == null && borehole.value.TotalDepth == null) ||
                        (x.TotalDepth != null && borehole.value.TotalDepth != null && Math.Abs(x.TotalDepth.Value - borehole.value.TotalDepth.Value) <= 0))
                    &&

                    // Check if LocationX values are both null or equal with tolerance of 2m
                    ((x.LocationX == null && borehole.value.LocationX == null) ||
                        (x.LocationX != null && borehole.value.LocationX != null && Math.Abs(x.LocationX.Value - borehole.value.LocationX.Value) <= 2))
                    &&

                    // Check if LocationY values are both null or equal with tolerance of 2m
                    ((x.LocationY == null && borehole.value.LocationY == null) ||
                        (x.LocationY != null && borehole.value.LocationY != null && Math.Abs(x.LocationY.Value - borehole.value.LocationY.Value) <= 2)));

            if (duplicatedBoreholeInDb != null)
            {
                ModelState.AddModelError($"Row{borehole.index}", $"Borehole with same Coordinates (+/- 2m) and same {nameof(Borehole.TotalDepth)} already exists in database.");
            }
        }
    }

    public static bool CompareValuesWithTolerance(double? value1, double? value2, double tolerance)
    {
        if (value1 == null && value2 == null) return true;
        if (value1 == null || value2 == null) return false;

        return Math.Abs(value1.Value - value2.Value) <= tolerance;
    }

    private List<BoreholeImport> ReadBoreholesFromCsv(IFormFile file)
    {
        var csvConfig = new CsvConfiguration(new CultureInfo("de-CH"))
        {
            Delimiter = ";",
            IgnoreReferences = true,
            PrepareHeaderForMatch = args => args.Header.Humanize(LetterCasing.Title),
            MissingFieldFound = null,
        };

        using var reader = new StreamReader(file.OpenReadStream());
        using var csv = new CsvReader(reader, csvConfig);

        csv.Context.RegisterClassMap(new CsvImportBoreholeMap());

        return csv.GetRecords<BoreholeImport>().ToList();
    }

    private async Task UpdateBoreholeLocationAndCoordinates(Borehole borehole)
    {
        // Use origin spatial reference system
        var locationX = borehole.OriginalReferenceSystem == ReferenceSystem.LV95 ? borehole.LocationX : borehole.LocationXLV03;
        var locationY = borehole.OriginalReferenceSystem == ReferenceSystem.LV95 ? borehole.LocationY : borehole.LocationYLV03;
        var srid = borehole.OriginalReferenceSystem == ReferenceSystem.LV95 ? sridLv95 : sridLv03;

        if (locationX == null || locationY == null) return;

        // Set coordinates for missing reference system.
        await coordinateService.MigrateCoordinatesOfBorehole(borehole, onlyMissing: false).ConfigureAwait(false);

        var locationInfo = await locationService.IdentifyAsync(locationX.Value, locationY.Value, srid).ConfigureAwait(false);
        if (locationInfo != null)
        {
            borehole.Country = locationInfo.Country;
            borehole.Canton = locationInfo.Canton;
            borehole.Municipality = locationInfo.Municipality;
        }
    }

    private sealed class CsvImportBoreholeMap : ClassMap<BoreholeImport>
    {
        private readonly CultureInfo swissCulture = new("de-CH");

        public CsvImportBoreholeMap()
        {
            var config = new CsvConfiguration(swissCulture)
            {
                IgnoreReferences = true,
                PrepareHeaderForMatch = args => args.Header.Humanize(LetterCasing.Title),
            };

            AutoMap(config);

            // Define all optional properties of Borehole (ef navigation properties do not need to be defined as optional).
            Map(m => m.Id).Optional();
            Map(m => m.CreatedById).Optional();
            Map(m => m.Created).Optional();
            Map(m => m.Updated).Optional();
            Map(m => m.UpdatedById).Optional();
            Map(m => m.Locked).Optional();
            Map(m => m.LockedById).Optional();
            Map(m => m.WorkgroupId).Optional();
            Map(m => m.IsPublic).Optional();
            Map(m => m.KindId).Optional();
            Map(m => m.ElevationZ).Optional();
            Map(m => m.HrsId).Optional();
            Map(m => m.TotalDepth).Optional();
            Map(m => m.RestrictionId).Optional();
            Map(m => m.RestrictionUntil).Optional();
            Map(m => m.AlternateName).Optional();
            Map(m => m.QtLocationId).Optional();
            Map(m => m.QtElevationId).Optional();
            Map(m => m.ProjectName).Optional();
            Map(m => m.DrillingMethodId).Optional();
            Map(m => m.DrillingDate).Optional();
            Map(m => m.CuttingsId).Optional();
            Map(m => m.PurposeId).Optional();
            Map(m => m.DrillingDiameter).Optional();
            Map(m => m.StatusId).Optional();
            Map(m => m.Inclination).Optional();
            Map(m => m.InclinationDirection).Optional();
            Map(m => m.QtInclinationDirectionId).Optional();
            Map(m => m.QtDepthId).Optional();
            Map(m => m.TopBedrock).Optional();
            Map(m => m.QtTopBedrockId).Optional();
            Map(m => m.HasGroundwater).Optional();
            Map(m => m.Remarks).Optional();
            Map(m => m.LithologyTopBedrockId).Optional();
            Map(m => m.LithostratigraphyId).Optional();
            Map(m => m.ChronostratigraphyId).Optional();
            Map(m => m.SpudDate).Optional();
            Map(m => m.TopBedrockTvd).Optional();
            Map(m => m.QtTopBedrockTvdId).Optional();
            Map(m => m.ReferenceElevation).Optional();
            Map(m => m.QtReferenceElevationId).Optional();
            Map(m => m.ReferenceElevationTypeId).Optional();
            Map(m => m.TotalDepthTvd).Optional();
            Map(m => m.QtTotalDepthTvdId).Optional();
            Map(m => m.LocationX).Optional();
            Map(m => m.LocationY).Optional();
            Map(m => m.LocationXLV03).Optional();
            Map(m => m.LocationYLV03).Optional();
            Map(m => m.OriginalReferenceSystem).Optional();

            // Define properties to ignore
            Map(b => b.Municipality).Ignore();
            Map(b => b.Canton).Ignore();
            Map(b => b.Country).Ignore();

            // Define additional mapping logic
            Map(m => m.BoreholeCodelists).Convert(args =>
            {
                var boreholeCodelists = new List<BoreholeCodelist>();
                new List<(string Name, int CodeListId)>
                {
                    ("id_geodin_shortname", 100000000),
                    ("id_info_geol", 100000003),
                    ("id_original", 100000004),
                    ("id_canton", 100000005),
                    ("id_geo_quat", 100000006),
                    ("id_geo_mol", 100000007),
                    ("id_geo_therm", 100000008),
                    ("id_top_fels", 100000009),
                    ("id_geodin", 100000010),
                    ("id_kernlager", 100000011),
                }.ForEach(id =>
                {
                    if (args.Row.HeaderRecord != null && args.Row.HeaderRecord.Any(h => h == id.Name))
                    {
                        var value = args.Row.GetField<string?>(id.Name);
                        if (!string.IsNullOrEmpty(value))
                        {
                            boreholeCodelists.Add(new BoreholeCodelist
                            {
                                CodelistId = id.CodeListId,
                                SchemaName = "borehole_identifier",
                                Value = value,
                            });
                        }
                    }
                });

                return boreholeCodelists;
            });
        }
    }

    private async Task<ActionResult<int>> SaveChangesAsync(Func<ActionResult<int>> successResult)
    {
        try
        {
            await context.UpdateChangeInformationAndSaveChangesAsync(HttpContext).ConfigureAwait(false);

            return successResult();
        }
        catch (Exception ex)
        {
            var errorMessage = "An error occurred while saving the entity changes.";
            logger?.LogError(ex, errorMessage);
            return Problem(errorMessage, statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}
