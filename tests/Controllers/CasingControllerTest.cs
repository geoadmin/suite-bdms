﻿using BDMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace BDMS.Controllers;

[TestClass]
public class CasingControllerTest
{
    private const int CompletionId = 14_000_003;

    private BdmsContext context;
    private CasingController controller;

    [TestInitialize]
    public void TestInitialize()
    {
        context = ContextFactory.GetTestContext();
        controller = new CasingController(context, new Mock<ILogger<Casing>>().Object);
        controller.ControllerContext.HttpContext = new DefaultHttpContext();
    }

    [TestCleanup]
    public async Task TestCleanup()
    {
        await context.DisposeAsync();
    }

    [TestMethod]
    public async Task GetAsync()
    {
        IEnumerable<Casing>? casings = await controller.GetAsync().ConfigureAwait(false);
        Assert.IsNotNull(casings);
        Assert.AreEqual(500, casings.Count());
    }

    [TestMethod]
    public async Task GetAsyncFilterByCompletionId()
    {
        // Precondition: Find a group of two casings with the same completion id.
        var completions = await context.Casings.ToListAsync();
        var completionId = completions
            .GroupBy(i => i.CompletionId)
            .Where(g => g.Count() == 2)
            .First().Key;

        IEnumerable<Casing>? casings = await controller.GetAsync(completionId).ConfigureAwait(false);
        Assert.IsNotNull(casings);
        Assert.AreEqual(2, casings.Count());
    }

    [TestMethod]
    public async Task GetByIdAsync()
    {
        var casingId = context.Casings.First().Id;

        var response = await controller.GetByIdAsync(casingId).ConfigureAwait(false);
        var casing = ActionResultAssert.IsOkObjectResult<Casing>(response.Result);
        Assert.AreEqual(casingId, casing.Id);
    }

    [TestMethod]
    public async Task CreateAsync()
    {
        var casing = new Casing()
        {
            CompletionId = CompletionId,
            Name = "COLLAR",
            FromDepth = 0,
            ToDepth = 100,
            MaterialId = context.Codelists.First(c => c.Schema == CompletionSchemas.CasingMaterialSchema).Id,
            KindId = context.Codelists.First(c => c.Schema == CompletionSchemas.CasingTypeSchema).Id,
            DateStart = new DateOnly(2021, 1, 1),
            DateFinish = new DateOnly(2021, 1, 2),
            InnerDiameter = 3,
            OuterDiameter = 4,
            Notes = "ARGONSHIP",
        };

        var response = await controller.CreateAsync(casing);
        ActionResultAssert.IsOkObjectResult<Casing>(response.Result);

        casing = await context.Casings.FindAsync(casing.Id);
        Assert.IsNotNull(casing);
        Assert.AreEqual(CompletionId, casing.CompletionId);
        Assert.AreEqual("ARGONSHIP", casing.Notes);
        Assert.AreEqual(0, casing.FromDepth);
        Assert.AreEqual(100, casing.ToDepth);
        Assert.AreEqual(context.Codelists.First(c => c.Schema == CompletionSchemas.CasingMaterialSchema).Id, casing.MaterialId);
        Assert.AreEqual(context.Codelists.First(c => c.Schema == CompletionSchemas.CasingTypeSchema).Id, casing.KindId);
        Assert.AreEqual(3, casing.InnerDiameter);
        Assert.AreEqual(4, casing.OuterDiameter);
        Assert.AreEqual(new DateOnly(2021, 1, 1), casing.DateStart);
        Assert.AreEqual(new DateOnly(2021, 1, 2), casing.DateFinish);
    }

    [TestMethod]
    public async Task EditAsync()
    {
        var casing = context.Casings.First();
        var completionId = casing.CompletionId;

        casing.MaterialId = context.Codelists.First(c => c.Schema == CompletionSchemas.CasingMaterialSchema).Id;
        casing.KindId = context.Codelists.First(c => c.Schema == CompletionSchemas.CasingTypeSchema).Id;
        casing.Notes = "COLLAR";
        casing.FromDepth = 50;
        casing.ToDepth = 200;

        var response = await controller.EditAsync(casing);
        ActionResultAssert.IsOkObjectResult<Casing>(response.Result);

        casing = await context.Casings.FindAsync(casing.Id);
        Assert.IsNotNull(casing);
        Assert.AreEqual(completionId, casing.CompletionId);
        Assert.AreEqual("COLLAR", casing.Notes);
        Assert.AreEqual(50, casing.FromDepth);
        Assert.AreEqual(200, casing.ToDepth);
        Assert.AreEqual(context.Codelists.First(c => c.Schema == CompletionSchemas.CasingMaterialSchema).Id, casing.MaterialId);
        Assert.AreEqual(context.Codelists.First(c => c.Schema == CompletionSchemas.CasingTypeSchema).Id, casing.KindId);
    }

    [TestMethod]
    public async Task DeleteCasing()
    {
        var casing = context.Casings
            .Include(c => c.Instrumentations)
            .Include(c => c.Observations)
            .AsNoTracking()
            .First(c => c.Instrumentations.Count > 0 && c.Observations.Count > 0);
        var instrumentationId = casing.Instrumentations.First().Id;
        var observationId = casing.Observations.First().Id;

        var casingCount = context.Casings.Count();
        var instrumentationCount = context.Instrumentations.Count();
        var observationCount = context.Observations.Count();

        var response = await controller.DeleteAsync(casing.Id);
        ActionResultAssert.IsOk(response);
        Assert.AreEqual(casingCount - 1, context.Casings.Count());

        Assert.AreEqual(instrumentationCount, context.Instrumentations.Count());
        var instrumentation = await context.Instrumentations
            .Include(i => i.Casing)
            .AsNoTracking()
            .SingleOrDefaultAsync(i => i.Id == instrumentationId);
        Assert.IsNotNull(instrumentation);
        Assert.IsNull(instrumentation.Casing);
        Assert.IsNull(instrumentation.CasingId);

        Assert.AreEqual(observationCount, context.Observations.Count());
        var observation = await context.Observations
            .Include(o => o.Casing)
            .AsNoTracking()
            .SingleOrDefaultAsync(o => o.Id == observationId);
        Assert.IsNotNull(observation);
        Assert.IsNull(observation.Casing);
        Assert.IsNull(observation.CasingId);
    }
}
