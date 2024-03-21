﻿using BDMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Security.Claims;
using static BDMS.Helpers;

namespace BDMS.Controllers;

[TestClass]
public class GroundwaterLevelMeasurementControllerTest
{
    private BdmsContext context;
    private GroundwaterLevelMeasurementController controller;

    [TestInitialize]
    public void TestInitialize()
    {
        context = ContextFactory.GetTestContext();
        var boreholeLockServiceMock = new Mock<IBoreholeLockService>(MockBehavior.Strict);
        boreholeLockServiceMock
            .Setup(x => x.IsBoreholeLockedAsync(It.IsAny<int?>(), It.IsAny<string?>()))
            .ReturnsAsync(false);
        controller = new GroundwaterLevelMeasurementController(context, new Mock<ILogger<GroundwaterLevelMeasurement>>().Object, boreholeLockServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, "TestUser") })),
                },
            },
        };
    }

    [TestCleanup]
    public async Task TestCleanup() => await context.DisposeAsync();

    [TestMethod]
    public async Task GetAsyncReturnsAllEntities()
    {
        var result = await controller.GetAsync();
        Assert.IsNotNull(result);
        Assert.AreEqual(111, result.Count());
    }

    [TestMethod]
    public async Task GetEntriesByBoreholeIdForInexistentId()
    {
        var response = await controller.GetAsync(94578122).ConfigureAwait(false);
        IEnumerable<GroundwaterLevelMeasurement>? groundwaterLevelMeasurements = response;
        Assert.IsNotNull(groundwaterLevelMeasurements);
        Assert.AreEqual(0, groundwaterLevelMeasurements.Count());
    }

    [TestMethod]
    public async Task GetEntriesByBoreholeId()
    {
        var response = await controller.GetAsync(1000595).ConfigureAwait(false);
        IEnumerable<GroundwaterLevelMeasurement>? groundwaterLevelMeasurements = response;
        Assert.IsNotNull(groundwaterLevelMeasurements);
        Assert.AreEqual(1, groundwaterLevelMeasurements.Count());
        var groundwaterLevelMeasurement = groundwaterLevelMeasurements.Single();

        Assert.AreEqual(groundwaterLevelMeasurement.Id, 12000009);
        Assert.AreEqual(groundwaterLevelMeasurement.Type, ObservationType.GroundwaterLevelMeasurement);
        Assert.AreEqual(groundwaterLevelMeasurement.Duration, 3955.791535689864);
        Assert.AreEqual(groundwaterLevelMeasurement.FromDepthM, 2480.3481396256702);
        Assert.AreEqual(groundwaterLevelMeasurement.ToDepthM, 3821.0916134552526);
        Assert.AreEqual(groundwaterLevelMeasurement.FromDepthMasl, 1289.6360662978311);
        Assert.AreEqual(groundwaterLevelMeasurement.ToDepthMasl, 4179.667294897915);
        Assert.AreEqual(groundwaterLevelMeasurement.IsOpenBorehole, false);
        Assert.AreEqual(groundwaterLevelMeasurement.Comment, "Libero voluptate corrupti et iste iure.");
        Assert.AreEqual(groundwaterLevelMeasurement.ReliabilityId, 15203157);
        Assert.AreEqual(groundwaterLevelMeasurement.KindId, 15203204);
        Assert.AreEqual(groundwaterLevelMeasurement.LevelM, 4345.999004703014);
        Assert.AreEqual(groundwaterLevelMeasurement.LevelMasl, 4723.28331899237);
    }

    [TestMethod]
    public async Task EditAsyncValidEntityUpdatesEntity()
    {
        var originalGroundwaterLevelMeasurement = new GroundwaterLevelMeasurement
        {
            Id = 1,
            Type = ObservationType.GroundwaterLevelMeasurement,
            StartTime = new DateTime(2006, 8, 21, 11, 00, 00).ToUniversalTime(),
            EndTime = new DateTime(2015, 11, 13, 14, 00, 00).ToUniversalTime(),
            Duration = 7909,
            FromDepthM = 67.789,
            ToDepthM = 78.15634,
            FromDepthMasl = 67.112,
            ToDepthMasl = 78.0043,
            IsOpenBorehole = true,
            Comment = "Test comment",
            BoreholeId = 1000595,
            ReliabilityId = context.Codelists.Where(c => c.Schema == HydrogeologySchemas.ObservationReliabilitySchema).Single(c => c.Geolcode == 4).Id,
            KindId = context.Codelists.Where(c => c.Schema == HydrogeologySchemas.GroundwaterLevelMeasurementKindSchema).Single(c => c.Geolcode == 3).Id,
            LevelM = 0.0,
            LevelMasl = 0.0,
        };

        var updatedGroundwaterLevelMeasurement = new GroundwaterLevelMeasurement
        {
            Id = 1,
            Type = ObservationType.GroundwaterLevelMeasurement,
            StartTime = new DateTime(2021, 12, 30, 21, 00, 00).ToUniversalTime(),
            EndTime = new DateTime(2023, 1, 1, 13, 00, 00).ToUniversalTime(),
            Duration = 168,
            FromDepthM = 517.532,
            ToDepthM = 7602.12,
            FromDepthMasl = 828.774,
            ToDepthMasl = 27603.2,
            IsOpenBorehole = true,
            Comment = "Updated test comment",
            BoreholeId = 1000595,
            ReliabilityId = context.Codelists.Where(c => c.Schema == HydrogeologySchemas.ObservationReliabilitySchema).Single(c => c.Geolcode == 2).Id,
            KindId = context.Codelists.Where(c => c.Schema == HydrogeologySchemas.GroundwaterLevelMeasurementKindSchema).Single(c => c.Geolcode == 1).Id,
            LevelM = 1.1,
            LevelMasl = 1.1,
        };

        context.GroundwaterLevelMeasurements.Add(originalGroundwaterLevelMeasurement);
        await context.SaveChangesAsync();

        var result = await controller.EditAsync(updatedGroundwaterLevelMeasurement);

        Assert.IsNotNull(result);
        ActionResultAssert.IsOk(result.Result);

        var editedGroundwaterLevelMeasurement = context.GroundwaterLevelMeasurements.Single(w => w.Id == 1);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.Id, editedGroundwaterLevelMeasurement.Id);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.Type, editedGroundwaterLevelMeasurement.Type);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.StartTime, editedGroundwaterLevelMeasurement.StartTime);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.EndTime, editedGroundwaterLevelMeasurement.EndTime);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.Duration, editedGroundwaterLevelMeasurement.Duration);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.FromDepthM, editedGroundwaterLevelMeasurement.FromDepthM);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.ToDepthM, editedGroundwaterLevelMeasurement.ToDepthM);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.FromDepthMasl, editedGroundwaterLevelMeasurement.FromDepthMasl);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.ToDepthMasl, editedGroundwaterLevelMeasurement.ToDepthMasl);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.IsOpenBorehole, editedGroundwaterLevelMeasurement.IsOpenBorehole);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.Comment, editedGroundwaterLevelMeasurement.Comment);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.BoreholeId, editedGroundwaterLevelMeasurement.BoreholeId);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.ReliabilityId, editedGroundwaterLevelMeasurement.ReliabilityId);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.KindId, editedGroundwaterLevelMeasurement.KindId);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.LevelM, editedGroundwaterLevelMeasurement.LevelM);
        Assert.AreEqual(updatedGroundwaterLevelMeasurement.LevelMasl, editedGroundwaterLevelMeasurement.LevelMasl);
    }

    [TestMethod]
    public async Task EditAsyncInvalidEntityReturnsNotFound()
    {
        var nonExistentGroundwaterLevelMeasurement = new GroundwaterLevelMeasurement { Id = 2964237 };

        var result = await controller.EditAsync(nonExistentGroundwaterLevelMeasurement);
        ActionResultAssert.IsNotFound(result.Result);
    }

    [TestMethod]
    public async Task CreateAndDeleteGroundwaterLevelMeasurementAsync()
    {
        var newGroundwaterLevelMeasurement = new GroundwaterLevelMeasurement
        {
            Type = ObservationType.GroundwaterLevelMeasurement,
            StartTime = new DateTime(2021, 1, 31, 1, 10, 00).ToUniversalTime(),
            EndTime = new DateTime(2020, 6, 4, 3, 4, 00).ToUniversalTime(),
            Duration = 118,
            FromDepthM = 17.532,
            ToDepthM = 702.12,
            FromDepthMasl = 82.714,
            ToDepthMasl = 2633.2,
            IsOpenBorehole = false,
            Comment = "New test comment",
            BoreholeId = 1000595,
            ReliabilityId = context.Codelists.Where(c => c.Schema == HydrogeologySchemas.ObservationReliabilitySchema).Single(c => c.Geolcode == 3).Id,
            KindId = context.Codelists.Where(c => c.Schema == HydrogeologySchemas.GroundwaterLevelMeasurementKindSchema).Single(c => c.Geolcode == 2).Id,
            LevelM = 348.4563,
            LevelMasl = 9945.15,
        };

        var createResponse = await controller.CreateAsync(newGroundwaterLevelMeasurement);
        ActionResultAssert.IsOk(createResponse.Result);

        newGroundwaterLevelMeasurement = await context.GroundwaterLevelMeasurements.FindAsync(newGroundwaterLevelMeasurement.Id);
        Assert.IsNotNull(newGroundwaterLevelMeasurement);
        Assert.AreEqual(newGroundwaterLevelMeasurement.Type, ObservationType.GroundwaterLevelMeasurement);
        Assert.AreEqual(newGroundwaterLevelMeasurement.StartTime, new DateTime(2021, 1, 31, 1, 10, 00).ToUniversalTime());
        Assert.AreEqual(newGroundwaterLevelMeasurement.EndTime, new DateTime(2020, 6, 4, 3, 4, 00).ToUniversalTime());
        Assert.AreEqual(newGroundwaterLevelMeasurement.Duration, 118);
        Assert.AreEqual(newGroundwaterLevelMeasurement.FromDepthM, 17.532);
        Assert.AreEqual(newGroundwaterLevelMeasurement.ToDepthM, 702.12);
        Assert.AreEqual(newGroundwaterLevelMeasurement.FromDepthMasl, 82.714);
        Assert.AreEqual(newGroundwaterLevelMeasurement.ToDepthMasl, 2633.2);
        Assert.AreEqual(newGroundwaterLevelMeasurement.IsOpenBorehole, false);
        Assert.AreEqual(newGroundwaterLevelMeasurement.Comment, "New test comment");
        Assert.AreEqual(newGroundwaterLevelMeasurement.BoreholeId, 1000595);
        Assert.AreEqual(newGroundwaterLevelMeasurement.ReliabilityId, 15203158);
        Assert.AreEqual(newGroundwaterLevelMeasurement.KindId, 15203204);
        Assert.AreEqual(newGroundwaterLevelMeasurement.LevelM, 348.4563);
        Assert.AreEqual(newGroundwaterLevelMeasurement.LevelMasl, 9945.15);

        var deleteResponse = await controller.DeleteAsync(newGroundwaterLevelMeasurement.Id);
        ActionResultAssert.IsOk(deleteResponse);

        deleteResponse = await controller.DeleteAsync(newGroundwaterLevelMeasurement.Id);
        ActionResultAssert.IsNotFound(deleteResponse);
    }
}
