﻿using BDMS.Authentication;
using BDMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using static BDMS.Helpers;

namespace BDMS.Controllers;

[TestClass]
public class StratigraphyControllerTest
{
    private const int StratigraphyId = 6_000_003;

    private BdmsContext context;
    private StratigraphyController controller;

    [TestInitialize]
    public void TestInitialize()
    {
        context = ContextFactory.GetTestContext();

        var boreholeLockServiceMock = new Mock<IBoreholeLockService>(MockBehavior.Strict);
        boreholeLockServiceMock
            .Setup(x => x.IsBoreholeLockedAsync(It.IsAny<int?>(), It.IsAny<string?>()))
            .ReturnsAsync(false);

        controller = new StratigraphyController(context, new Mock<ILogger<Stratigraphy>>().Object, boreholeLockServiceMock.Object) { ControllerContext = GetControllerContextAdmin() };
    }

    [TestCleanup]
    public async Task TestCleanup() => await context.DisposeAsync();

    [TestMethod]
    public async Task GetAsyncReturnsAllEntities()
    {
        var stratigraphies = await controller.GetAsync();
        Assert.IsNotNull(stratigraphies);
        Assert.AreEqual(3000, stratigraphies.Count());
    }

    [TestMethod]
    public async Task GetEntriesByBoreholeIdForInexistentId()
    {
        var stratigraphies = await controller.GetAsync(81294572).ConfigureAwait(false);
        Assert.IsNotNull(stratigraphies);
        Assert.AreEqual(0, stratigraphies.Count());
    }

    [TestMethod]
    public async Task GetEntriesByProfileIdExistingIdNoLayers()
    {
        var emptyBorehole = new Borehole();
        context.Boreholes.Add(emptyBorehole);
        await context.SaveChangesAsync().ConfigureAwait(false);

        var layers = await controller.GetAsync(emptyBorehole.Id).ConfigureAwait(false);
        Assert.IsNotNull(layers);
        Assert.AreEqual(0, layers.Count());
    }

    [TestMethod]
    public async Task GetStratigraphyByBoreholeId()
    {
        var stratigraphies = await controller.GetAsync(1000017).ConfigureAwait(false);
        Assert.IsNotNull(stratigraphies);
        Assert.AreEqual(1, stratigraphies.Count());
        var stratigraphy = stratigraphies.Single();

        Assert.AreEqual(1000017, stratigraphy.BoreholeId);
        Assert.AreEqual(3000, stratigraphy.KindId);
        Assert.AreEqual("Marie Parker", stratigraphy.Name);
        Assert.AreEqual("i use it for 10 weeks when i'm in my jail.", stratigraphy.Notes);
        Assert.AreEqual(1, stratigraphy.CreatedById);
        Assert.AreEqual(2, stratigraphy.UpdatedById);
        Assert.AreEqual(false, stratigraphy.IsPrimary);
    }

    [TestMethod]
    public async Task GetById()
    {
        var stratigraphyResult = await controller.GetByIdAsync(StratigraphyId);

        var stratigraphy = ActionResultAssert.IsOkObjectResult<Stratigraphy>(stratigraphyResult.Result);
        Assert.AreEqual(1002423, stratigraphy.BoreholeId);
        Assert.AreEqual("Jaycee Beahan", stratigraphy.Name);
        Assert.AreEqual("It only works when I'm Kuwait.", stratigraphy.Notes);
    }

    [TestMethod]
    public async Task GetByUnknownId()
    {
        var stratigraphyResult = await controller.GetByIdAsync(int.MinValue);
        ActionResultAssert.IsNotFound(stratigraphyResult.Result);
    }

    [TestMethod]
    public async Task Copy()
    {
        var originalStratigraphy = GetStratigraphy(StratigraphyId);
        Assert.IsNotNull(originalStratigraphy?.Layers, "Precondition: Stratigraphy has Layers");
        Assert.IsTrue(originalStratigraphy?.Layers.Any(x => x.LayerCodelists?.Any() ?? false), "Precondition: Stratigraphy has layers with multiple codelist values");
        Assert.IsNotNull(originalStratigraphy?.LithologicalDescriptions, "Precondition: Stratigraphy has LithologicalDescriptions");
        Assert.IsNotNull(originalStratigraphy?.FaciesDescriptions, "Precondition: Stratigraphy has FaciesDescriptions");

        var result = await controller.CopyAsync(StratigraphyId).ConfigureAwait(false);
        ActionResultAssert.IsOk(result.Result);

        var copiedStratigraphyId = ((OkObjectResult?)result.Result)?.Value;
        Assert.IsNotNull(copiedStratigraphyId);
        Assert.IsInstanceOfType(copiedStratigraphyId, typeof(int));
        var copiedStratigraphy = GetStratigraphy((int)copiedStratigraphyId);

        Assert.AreEqual("Jaycee Beahan (Clone)", copiedStratigraphy.Name);
        Assert.AreEqual("sub_admin", copiedStratigraphy.CreatedBy.SubjectId);
        Assert.AreEqual("sub_controller", copiedStratigraphy.UpdatedBy.SubjectId);
        Assert.AreEqual(false, copiedStratigraphy.IsPrimary);
        Assert.AreSame(originalStratigraphy.Kind, copiedStratigraphy.Kind);

        Assert.AreNotEqual(originalStratigraphy.Id, copiedStratigraphy.Id);
        Assert.AreNotSame(originalStratigraphy.Layers, copiedStratigraphy.Layers);
        Assert.AreNotEqual(originalStratigraphy.Layers.First().Id, copiedStratigraphy.Layers.First().Id);

        Assert.AreNotSame(originalStratigraphy.LithologicalDescriptions, copiedStratigraphy.LithologicalDescriptions);
        Assert.AreNotEqual(originalStratigraphy.LithologicalDescriptions.First().Id, copiedStratigraphy.LithologicalDescriptions.First().Id);
        Assert.AreEqual("Drives olive mobile", copiedStratigraphy.LithologicalDescriptions.First().Description);

        Assert.AreNotSame(originalStratigraphy.FaciesDescriptions, copiedStratigraphy.FaciesDescriptions);
        Assert.AreNotEqual(originalStratigraphy.FaciesDescriptions.First().Id, copiedStratigraphy.FaciesDescriptions.First().Id);
        Assert.AreEqual("Drives olive mobile", copiedStratigraphy.FaciesDescriptions.First().Description);

        Assert.AreNotSame(originalStratigraphy.ChronostratigraphyLayers, copiedStratigraphy.ChronostratigraphyLayers);
        Assert.AreNotEqual(originalStratigraphy.ChronostratigraphyLayers.First().Id, copiedStratigraphy.ChronostratigraphyLayers.First().Id);
        Assert.AreEqual(15001144, copiedStratigraphy.ChronostratigraphyLayers.First().ChronostratigraphyId);

        Assert.AreNotSame(originalStratigraphy.Layers.First().LayerCodelists, copiedStratigraphy.Layers.First().LayerCodelists);
        Assert.AreEqual(originalStratigraphy.Layers.First().LayerCodelists.Count, copiedStratigraphy.Layers.First().LayerCodelists.Count);
    }

    private Stratigraphy? GetStratigraphy(int id)
    {
        return context.Stratigraphies
            .Include(s => s.CreatedBy)
            .Include(s => s.UpdatedBy)
            .Include(s => s.Kind)
            .Include(s => s.Layers).ThenInclude(l => l.LayerCodelists)
            .Include(s => s.LithologicalDescriptions)
            .Include(s => s.FaciesDescriptions)
            .Include(s => s.ChronostratigraphyLayers)
            .SingleOrDefault(s => s.Id == id);
    }

    [TestMethod]
    public async Task CopyInvalidStratigraphyId()
    {
        var result = await controller.CopyAsync(0).ConfigureAwait(false);
        ActionResultAssert.IsNotFound(result.Result);
    }

    [TestMethod]
    public async Task CopyWithUnknownUser()
    {
        controller.HttpContext.SetClaimsPrincipal("NON-EXISTENT-NAME", PolicyNames.Admin);
        var result = await controller.CopyAsync(StratigraphyId).ConfigureAwait(false);
        ActionResultAssert.IsUnauthorized(result.Result);
    }

    [TestMethod]
    public async Task CopyWithUserNotSet()
    {
        controller.ControllerContext.HttpContext.User = null;
        await Assert.ThrowsExceptionAsync<InvalidOperationException>(async () =>
        {
            await controller.CopyAsync(StratigraphyId).ConfigureAwait(false);
        });
    }

    [TestMethod]
    public async Task CopyWithNonAdminUser()
    {
        controller.HttpContext.SetClaimsPrincipal("sub_editor", PolicyNames.Viewer);
        var result = await controller.CopyAsync(StratigraphyId).ConfigureAwait(false);
        ActionResultAssert.IsOk(result.Result);

        // delete stratigraphy copy
        var copiedStratigraphyId = ((OkObjectResult?)result.Result)?.Value;
        Assert.IsNotNull(copiedStratigraphyId);
        Assert.IsInstanceOfType(copiedStratigraphyId, typeof(int));
    }

    [TestMethod]
    public async Task Delete()
    {
        // Prepare stratigraphy to delete
        var copyResult = await controller.CopyAsync(StratigraphyId).ConfigureAwait(false);
        ActionResultAssert.IsOk(copyResult.Result);

        var stratigraphyToDeleteId = ((OkObjectResult?)copyResult.Result)?.Value;
        Assert.IsNotNull(stratigraphyToDeleteId);

        // Delete and assert
        var stratigraphyToDelete = GetStratigraphy((int)stratigraphyToDeleteId);
        await controller.DeleteAsync(stratigraphyToDelete.Id).ConfigureAwait(false);
        Assert.AreEqual(null, GetStratigraphy((int)stratigraphyToDeleteId));
    }

    [TestMethod]
    public async Task DeleteMainStratigraphySetsLatestStratigraphyAsPrimary()
    {
        // Precondition: Find a group of three stratigraphies with one main stratigraphy
        var stratigraphies = await controller.GetAsync();
        var stratigraphyTestCandidates = stratigraphies
            .Where(x => x.KindId == StratigraphyController.StratigraphyKindId && x.BoreholeId != null)
            .GroupBy(x => x.BoreholeId)
            .Where(g => g.Count(s => s.IsPrimary == true) == 0)
            .ToList();

        var primaryStratigraphy = new Stratigraphy
        {
            Id = stratigraphies.Max(x => x.Id) + 1,
            KindId = StratigraphyController.StratigraphyKindId,
            BoreholeId = stratigraphyTestCandidates.First().Key,
            IsPrimary = true,
            Name = "KODACLUSTER",
            Notes = "ARGONTITAN",
        };

        context.Add(primaryStratigraphy);

        await context.SaveChangesAsync();

        Assert.AreEqual(true, stratigraphyTestCandidates.Any(), "Precondition: There is at least one group of stratigraphies with one main stratigraphy");

        // Delete primary stratigraphy and assert that
        // the latest stratigraphy is now the main stratigraphy
        var stratigraphiesUnderTest = stratigraphyTestCandidates.First();
        var latestNonPrimaryStratigraphy = stratigraphiesUnderTest.Where(x => !x.IsPrimary.GetValueOrDefault()).OrderByDescending(x => x.Created).First();

        await controller.DeleteAsync(primaryStratigraphy.Id).ConfigureAwait(false);
        Assert.AreEqual(null, GetStratigraphy(primaryStratigraphy.Id));

        latestNonPrimaryStratigraphy = GetStratigraphy(latestNonPrimaryStratigraphy.Id);
        Assert.AreNotEqual(null, latestNonPrimaryStratigraphy);
        Assert.AreEqual(true, latestNonPrimaryStratigraphy.IsPrimary.GetValueOrDefault());
    }

    [TestMethod]
    public async Task Create()
    {
        var boreholeWithoutStratigraphy = await context
            .Boreholes
            .Include(b => b.Stratigraphies)
            .FirstAsync(b => !b.Stratigraphies.Any());

        var stratigraphyToAdd = new Stratigraphy
        {
            KindId = StratigraphyController.StratigraphyKindId,
            BoreholeId = boreholeWithoutStratigraphy.Id,
            Name = "KODACLUSTER",
            Notes = "ARGONTITAN",
            QualityId = 9003,
        };

        var createResult = await controller.CreateAsync(stratigraphyToAdd);
        ActionResultAssert.IsOk(createResult.Result);

        var createdStratigraphy = (Stratigraphy?)((OkObjectResult)createResult.Result!).Value;
        createdStratigraphy = GetStratigraphy(createdStratigraphy.Id);
        AssertStratigraphy(createdStratigraphy, boreholeWithoutStratigraphy.Id, "KODACLUSTER", "ARGONTITAN", 9003);

        // Because the stratigraphy is the first one for the borehole, it is automatically the primary stratigraphy.
        Assert.AreEqual(true, createdStratigraphy.IsPrimary);
    }

    [TestMethod]
    public async Task CreateAdditionalStratigraphyForExistingBorehole()
    {
        var boreholeWithExistingStratigraphy = await context
            .Boreholes
            .Include(b => b.Stratigraphies)
            .FirstAsync(b => b.Stratigraphies.Any());

        var stratigraphyToAdd = new Stratigraphy
        {
            KindId = StratigraphyController.StratigraphyKindId,
            BoreholeId = boreholeWithExistingStratigraphy.Id,
            Name = "STORMSTEED",
            Notes = "GALAXYJEEP",
        };

        var createResult = await controller.CreateAsync(stratigraphyToAdd);
        ActionResultAssert.IsOk(createResult.Result);

        var createdStratigraphy = (Stratigraphy?)((OkObjectResult)createResult.Result!).Value;
        createdStratigraphy = GetStratigraphy(createdStratigraphy.Id);
        AssertStratigraphy(createdStratigraphy, boreholeWithExistingStratigraphy.Id, "STORMSTEED", "GALAXYJEEP");

        // Because the stratigraphy is the second one for the borehole, it is not automatically the primary stratigraphy.
        Assert.AreEqual(false, createdStratigraphy.IsPrimary);
    }

    [TestMethod]
    public async Task CreateWithNullStratigraphy()
    {
        var createResult = await controller.CreateAsync(null);
        ActionResultAssert.IsBadRequest(createResult.Result);
    }

    [TestMethod]
    public async Task CreateWithInvalidStratigraphy()
    {
        var inexistentBoreholeId = int.MinValue;
        var invalidStratigraphy = new Stratigraphy { BoreholeId = inexistentBoreholeId };
        var createResult = await controller.CreateAsync(invalidStratigraphy);
        ActionResultAssert.IsInternalServerError(createResult.Result);
    }

    [TestMethod]
    public async Task CreateWithUserNotSet()
    {
        controller.ControllerContext.HttpContext.User = null;
        var createResult = await controller.CreateAsync(new());
        ActionResultAssert.IsInternalServerError(createResult.Result);
    }

    [TestMethod]
    public async Task CreateForLockedBorehole()
    {
        SetupControllerWithAlwaysLockedBorehole();

        var createResult = await controller.CreateAsync(new());
        ActionResultAssert.IsInternalServerError(createResult.Result);
    }

    [TestMethod]
    public async Task AddBedrockLayer()
    {
        // Prepare stratigraphy to add the bedrock layer for.
        var boreholeWithBedrock = await context.Boreholes.FirstAsync(x => x.TopBedrock.HasValue);
        var stratigraphyWithoutBedrockLayer = new Stratigraphy
        {
            KindId = StratigraphyController.StratigraphyKindId,
            BoreholeId = boreholeWithBedrock.Id,
            Name = "MAESTROHEART",
            Notes = "BATONTOPPER",
        };

        var createResult = await controller.CreateAsync(stratigraphyWithoutBedrockLayer);
        stratigraphyWithoutBedrockLayer = ActionResultAssert.IsOkObjectResult<Stratigraphy>(createResult.Result);
        AssertStratigraphy(stratigraphyWithoutBedrockLayer, boreholeWithBedrock.Id, "MAESTROHEART", "BATONTOPPER");

        // Add bedrock and assert
        var addBedrockResult = await controller.AddBedrockLayerAsync(stratigraphyWithoutBedrockLayer.Id);
        ActionResultAssert.IsOk(addBedrockResult.Result);

        var bedrockLayerId = (int)((OkObjectResult?)addBedrockResult.Result)?.Value!;
        var bedrockLayer = await context.Layers.FindAsync(bedrockLayerId);
        Assert.AreEqual(stratigraphyWithoutBedrockLayer.Id, bedrockLayer.StratigraphyId);
        Assert.AreEqual(boreholeWithBedrock.TopBedrock.Value, bedrockLayer.FromDepth);
        Assert.AreEqual(boreholeWithBedrock.LithologyTopBedrockId, bedrockLayer.LithologyTopBedrockId);
        Assert.AreEqual(boreholeWithBedrock.LithostratigraphyId, bedrockLayer.LithostratigraphyId);
        Assert.AreEqual(false, bedrockLayer.IsLast);
    }

    [TestMethod]
    public async Task AddBedrockLayerForBoreholeWithoutTopBedrockValue()
    {
        // Prepare stratigraphy to add the bedrock layer for.
        var boreholeWithoutBedrock = await context.Boreholes.FirstAsync(x => !x.TopBedrock.HasValue);
        var stratigraphyWithoutBedrockLayer = new Stratigraphy
        {
            KindId = StratigraphyController.StratigraphyKindId,
            BoreholeId = boreholeWithoutBedrock.Id,
            Name = "CHIPPEWARECORD",
            Notes = "FIREFALCON",
        };

        var createResult = await controller.CreateAsync(stratigraphyWithoutBedrockLayer);
        stratigraphyWithoutBedrockLayer = ActionResultAssert.IsOkObjectResult<Stratigraphy>(createResult.Result);
        AssertStratigraphy(stratigraphyWithoutBedrockLayer, boreholeWithoutBedrock.Id, "CHIPPEWARECORD", "FIREFALCON");

        var addBedrockResult = await controller.AddBedrockLayerAsync(stratigraphyWithoutBedrockLayer.Id);
        ActionResultAssert.IsInternalServerError(addBedrockResult.Result, "bedrock");
    }

    [TestMethod]
    public async Task AddBedrockLayerForLockedBorehole()
    {
        SetupControllerWithAlwaysLockedBorehole();

        var existingStratigraphy = await context.Stratigraphies.FirstAsync();
        var addBedrockResult = await controller.AddBedrockLayerAsync(existingStratigraphy.Id);
        ActionResultAssert.IsInternalServerError(addBedrockResult.Result, "locked");
    }

    [TestMethod]
    public async Task Edit()
    {
        var borehole = await context.Boreholes.OrderBy(x => x.CreatedById).LastAsync();
        var stratigraphyToEdit = await context.Stratigraphies.FirstAsync();
        stratigraphyToEdit.BoreholeId = borehole.Id;
        stratigraphyToEdit.KindId = StratigraphyController.StratigraphyKindId;
        stratigraphyToEdit.IsPrimary = false;
        stratigraphyToEdit.Date = new DateTime(1999, 9, 9).ToUniversalTime();
        stratigraphyToEdit.Name = "ERRONEOUS";
        stratigraphyToEdit.Notes = "REDPOINT";
        stratigraphyToEdit.QualityId = 9000;

        var editResult = await controller.EditAsync(stratigraphyToEdit);
        var editedStratigraphy = ActionResultAssert.IsOkObjectResult<Stratigraphy>(editResult.Result);
        Assert.AreEqual(borehole.Id, editedStratigraphy.BoreholeId);
        Assert.AreEqual(StratigraphyController.StratigraphyKindId, editedStratigraphy.KindId);
        Assert.AreEqual(false, editedStratigraphy.IsPrimary);
        Assert.AreEqual(new DateTime(1999, 9, 9).ToUniversalTime(), editedStratigraphy.Date);
        Assert.AreEqual("ERRONEOUS", editedStratigraphy.Name);
        Assert.AreEqual("REDPOINT", editedStratigraphy.Notes);
        Assert.AreEqual(9000, editedStratigraphy.QualityId);
    }

    [TestMethod]
    public async Task EditSetMainStratigraphy()
    {
        // Precondition: Create two stratigraphies for the same borehole,
        // one of which is the main stratigraphy.
        var boreholeWithoutStratigraphy = await context
            .Boreholes
            .Include(b => b.Stratigraphies)
            .FirstAsync(b => !b.Stratigraphies.Any());

        var firstStratigraphy = new Stratigraphy
        {
            IsPrimary = true,
            KindId = StratigraphyController.StratigraphyKindId,
            BoreholeId = boreholeWithoutStratigraphy.Id,
            Name = "FALLOUT-VII",
        };

        var secondStratigraphy = new Stratigraphy
        {
            IsPrimary = false,
            KindId = StratigraphyController.StratigraphyKindId,
            BoreholeId = boreholeWithoutStratigraphy.Id,
            Name = "KARMACANDID",
        };

        firstStratigraphy = ActionResultAssert.IsOkObjectResult<Stratigraphy>((await controller.CreateAsync(firstStratigraphy)).Result);
        secondStratigraphy = ActionResultAssert.IsOkObjectResult<Stratigraphy>((await controller.CreateAsync(secondStratigraphy)).Result);

        // Setting the second stratigraphy as the main stratigraphy
        // should set the first stratigraphy as non-main.
        secondStratigraphy.IsPrimary = true;
        secondStratigraphy = ActionResultAssert.IsOkObjectResult<Stratigraphy>((await controller.EditAsync(secondStratigraphy)).Result);
        Assert.AreEqual(true, secondStratigraphy.IsPrimary);
        Assert.AreEqual("KARMACANDID", secondStratigraphy.Name);

        firstStratigraphy = GetStratigraphy(firstStratigraphy.Id);
        Assert.AreEqual(false, firstStratigraphy.IsPrimary);
        Assert.AreEqual("FALLOUT-VII", firstStratigraphy.Name);
    }

    [TestMethod]
    public async Task EditForLockedBorehole()
    {
        SetupControllerWithAlwaysLockedBorehole();

        var existingStratigraphy = await context.Stratigraphies.FirstAsync();
        var editResult = await controller.EditAsync(existingStratigraphy);
        ActionResultAssert.IsInternalServerError(editResult.Result, "locked");
    }

    private void AssertStratigraphy(Stratigraphy actual, int expectedBoreholeId, string exptectedName, string expectedNotes, int? qualityId = null)
    {
        Assert.AreEqual(StratigraphyController.StratigraphyKindId, actual.KindId);
        Assert.AreEqual(expectedBoreholeId, actual.BoreholeId);
        Assert.AreEqual(exptectedName, actual.Name);
        Assert.AreEqual(expectedNotes, actual.Notes);
        Assert.AreEqual(qualityId, actual.QualityId);
    }

    private void SetupControllerWithAlwaysLockedBorehole()
    {
        var boreholeLockServiceMock = new Mock<IBoreholeLockService>(MockBehavior.Strict);
        boreholeLockServiceMock
            .Setup(x => x.IsBoreholeLockedAsync(It.IsAny<int?>(), It.IsAny<string?>()))
            .ReturnsAsync(true);

        controller = new StratigraphyController(context, new Mock<ILogger<Stratigraphy>>().Object, boreholeLockServiceMock.Object) { ControllerContext = GetControllerContextAdmin() };
    }
}
