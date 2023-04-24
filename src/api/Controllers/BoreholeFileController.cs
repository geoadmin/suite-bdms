﻿using BDMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BDMS.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class BoreholeFileController : ControllerBase
{
    private readonly BdmsContext context;
    private readonly CloudStorageService storageService;
    private readonly ILogger logger;

    public BoreholeFileController(BdmsContext context, ILogger<BoreholeFileController> logger, CloudStorageService storageService)
        : base()
    {
        this.logger = logger;
        this.storageService = storageService;
        this.context = context;
    }

    /// <summary>
    /// Uploads a file to the cloud storage and links it to the borehole.
    /// </summary>
    /// <param name="file">The file to upload and link to the <see cref="Borehole"/>.</param>
    /// <param name="boreholeId">The <see cref="Borehole.Id"/> to link the uploaded <paramref name="file"/> to.</param>
    [HttpPost("upload")]
    public async Task<ActionResult> Upload(IFormFile file, int boreholeId)
    {
        if (file == null || file.Length == 0) return BadRequest("No File provided.");

        try
        {
            await storageService.UploadFileToStorageAndLinkToBorehole(file, boreholeId).ConfigureAwait(false);
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while uploading the file.");
            return Problem("An error occurred while uploading the file.");
        }
    }

    /// <summary>
    /// Downloads a file from the cloud storage.
    /// </summary>
    /// <param name="boreholeFileId">The <see cref="BoreholeFile.FileId"/> of the file to download.</param>
    /// <returns>The stream of the downloaded file.</returns>
    [HttpGet("download")]
    public async Task<IActionResult> Download(int boreholeFileId)
    {
        try
        {
            var boreholeFile = await context.BoreholeFiles
                .Include(f => f.File)
                .FirstOrDefaultAsync(f => f.FileId == boreholeFileId)
                .ConfigureAwait(false);

            if (boreholeFile.File?.NameUuid == null)
            {
                return NotFound($"File with ID {boreholeFileId} not found in borehole.");
            }

            var fileBytes = await storageService.GetObject(boreholeFile.File.NameUuid).ConfigureAwait(false);

            return File(fileBytes, "application/octet-stream", boreholeFile.File.Name);
        }
        catch (Exception ex)
        {
            logger.Log(LogLevel.Error, ex, "An error occurred while downloading the file.");
            return Problem("An error occurred while downloading the file.");
        }
    }

    /// <summary>
    /// Get all <see cref="BoreholeFile"/> that are linked to the <see cref="Borehole"/> with <see cref="Borehole.Id"/> provided in <paramref name="boreholeId"/>.
    /// </summary>
    /// <param name="boreholeId"></param>
    /// <returns>A list of <see cref="BoreholeFile"/>.</returns>
    [HttpGet("getAllForBorehole")]
    public async Task<IEnumerable<BoreholeFile>> GetAllOfBorehole(int boreholeId)
    {
        return await context.BoreholeFiles
            .Where(bf => bf.BoreholeId == boreholeId)
            .AsNoTracking()
            .ToListAsync()
            .ConfigureAwait(false);
    }

    /// <summary>
    /// Detaches a <see cref="BoreholeFile"/> from the <see cref="Borehole"/> with <see cref="Borehole.Id"/> provided in <paramref name="boreholeId"/>.
    /// </summary>
    /// <param name="boreholeId">The <see cref="Borehole.Id"/> of the borehole to detach the file from.</param>
    /// <param name="boreholeFileId">The <see cref="BoreholeFile.FileId"/> of the file to detach from the borehole.</param>
    /// <returns>An IActionResult indicating the status of the operation.</returns>
    [HttpPost("detachFile")]
    public async Task<IActionResult> DetachFromBorehole(int boreholeId, int boreholeFileId)
    {
        try
        {
            // Get the file and its BoreholeFiles from the database.
            var boreholeFile = await context.BoreholeFiles
                .Include(f => f.File)
                .FirstOrDefaultAsync(f => f.FileId == boreholeFileId)
                .ConfigureAwait(false);

            var file = boreholeFile.File;

            // If the file exists, remove the requested BoreholeFile from the database.
            if (boreholeFile?.File != null)
            {
                file.BoreholeFiles.Remove(file.BoreholeFiles.First(bf => bf.FileId == boreholeFileId && bf.BoreholeId == boreholeId));
                await context.SaveChangesAsync().ConfigureAwait(false);
            }

            // If the file is not linked to any boreholes, delete it from the cloud storage and the database.
            if (file.BoreholeFiles.Count == 0 && file.NameUuid != null)
            {
                await storageService.DeleteObject(file.NameUuid).ConfigureAwait(false);
                context.Files.Remove(file);
                await context.SaveChangesAsync().ConfigureAwait(false);
            }

            return Ok();
        }
        catch (Exception ex)
        {
            logger.Log(LogLevel.Error, ex, "An error occurred while detaching the file.");
            return Problem("An error occurred while detaching the file.");
        }
    }
}
