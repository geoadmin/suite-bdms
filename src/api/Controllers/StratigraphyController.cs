﻿using BDMS.Authentication;
using BDMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace BDMS.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class StratigraphyController : ControllerBase
{
    private readonly BdmsContext context;
    private readonly ILogger logger;

    public StratigraphyController(BdmsContext context, ILogger<StratigraphyController> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    /// <summary>
    /// Asynchronously copies a <see cref="Stratigraphy"/>.
    /// </summary>
    /// <param name="id">The <see cref="Stratigraphy.Id"/> of the stratigraphy to copy.</param>
    /// <returns>The id of the newly created <see cref="Stratigraphy"/>.</returns>
    [HttpPost("copy")]
    [Authorize(Policy = PolicyNames.Viewer)]
    public async Task<ActionResult<int>> CopyAsync([Required] int id)
    {
        logger.LogInformation("Copy stratigraphy with id <{StratigraphyId}>", id);

        var user = await context.Users
            .Include(u => u.WorkgroupRoles)
            .AsNoTracking()
            .SingleOrDefaultAsync(u => u.Name == HttpContext.User.FindFirst(ClaimTypes.Name).Value)
            .ConfigureAwait(false);

        if (user == null || !user.WorkgroupRoles.Any(w => w.Role == Role.Editor))
        {
            return Unauthorized();
        }

        var stratigraphy = await context.Stratigraphies
            .Include(s => s.Layers).ThenInclude(l => l.LayerCodelists)
            .Include(s => s.LithologicalDescriptions)
            .Include(s => s.FaciesDescriptions)
            .AsNoTracking()
            .SingleOrDefaultAsync(b => b.Id == id)
            .ConfigureAwait(false);

        if (stratigraphy == null)
        {
            return NotFound();
        }

        // Set ids of copied entities to zero. Entities with an id of zero are added as new entities to the DB.
        stratigraphy.Id = 0;

        foreach (var layer in stratigraphy.Layers)
        {
            layer.Id = 0;
            foreach (var layerCode in layer.LayerCodelists)
            {
                layerCode.LayerId = 0;
            }
        }

        foreach (var lithologicalDescription in stratigraphy.LithologicalDescriptions)
        {
            lithologicalDescription.Id = 0;
        }

        foreach (var faciesDescription in stratigraphy.FaciesDescriptions)
        {
            faciesDescription.Id = 0;
        }

        stratigraphy.Name += " (Clone)";

        var entityEntry = await context.AddAsync(stratigraphy).ConfigureAwait(false);
        await context.SaveChangesAsync().ConfigureAwait(false);

        return Ok(entityEntry.Entity.Id);
    }
}
