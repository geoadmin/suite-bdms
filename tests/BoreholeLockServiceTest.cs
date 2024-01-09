﻿using BDMS.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace BDMS;

[TestClass]
public class BoreholeLockServiceTest
{
    private const string EditorUserName = "editor";
    private const int EditorUserId = 2;

    private BoreholeLockService boreholeLockService;
    private BdmsContext context;

    [TestInitialize]
    public void TestInitialize()
    {
        context = ContextFactory.GetTestContext();
        var loggerMock = new Mock<ILogger<BoreholeLockService>>();
        var timeProviderMock = new Mock<TimeProvider>();

        boreholeLockService = new BoreholeLockService(context, loggerMock.Object, timeProviderMock.Object);
    }

    [TestCleanup]
    public async Task TestCleanup() => await context.DisposeAsync();

    [TestMethod]
    public async Task IsBoreholeLockedWithUserNotSet()
        => await Assert.ThrowsExceptionAsync<InvalidOperationException>(async () => await boreholeLockService.IsBoreholeLockedAsync(null, null));

    [TestMethod]
    public async Task IsBoreholeLockedWithUnknownUser()
        => await Assert.ThrowsExceptionAsync<InvalidOperationException>(async () => await boreholeLockService.IsBoreholeLockedAsync(null, "NON-EXISTENT-NAME"));

    [TestMethod]
    public async Task IsBoreholeLockedWithUnknownBorehole()
        => await Assert.ThrowsExceptionAsync<InvalidOperationException>(async () => await boreholeLockService.IsBoreholeLockedAsync(null, EditorUserName));

    [TestMethod]
    public async Task IsBoreholeLockedWithUnauthorizedUser()
    {
        var borehole = await context.Boreholes.FirstAsync();
        await Assert.ThrowsExceptionAsync<UnauthorizedAccessException>(async () => await boreholeLockService.IsBoreholeLockedAsync(borehole.Id, "deletableUser"));
    }

    [TestMethod]
    public async Task IsBoreholeLockedByOtherUser()
    {
        var borehole = GetLockedBorehole(lockedByEditor: false);

        // Fake a date which is within the lock timeout
        var timeProviderMock = CreateTimeProviderMock(borehole.Locked.Value.AddMinutes(1));
        boreholeLockService = new BoreholeLockService(context, new Mock<ILogger<BoreholeLockService>>().Object, timeProviderMock.Object);

        Assert.AreEqual(true, await boreholeLockService.IsBoreholeLockedAsync(borehole.Id, EditorUserName));
    }

    [TestMethod]
    public async Task CreateForLockedBoreholeBySameUser()
    {
        var borehole = GetLockedBorehole(lockedByEditor: true);

        // Fake a date which is within the lock timeout
        var fakeUtcDate = borehole.Locked.Value.AddMinutes(BoreholeLockService.LockTimeoutInMinutes - 1);
        var timeProviderMock = CreateTimeProviderMock(fakeUtcDate);
        boreholeLockService = new BoreholeLockService(context, new Mock<ILogger<BoreholeLockService>>().Object, timeProviderMock.Object);

        Assert.AreEqual(false, await boreholeLockService.IsBoreholeLockedAsync(borehole.Id, EditorUserName));
    }

    [TestMethod]
    public async Task CreateForLockedBoreholeWithElapsedLockTimeout()
    {
        var borehole = GetLockedBorehole(lockedByEditor: false);

        // Fake a date which is after the lock timeout
        var fakeUtcDate = borehole.Locked.Value.AddMinutes(BoreholeLockService.LockTimeoutInMinutes + 1);
        var timeProviderMock = CreateTimeProviderMock(fakeUtcDate);
        boreholeLockService = new BoreholeLockService(context, new Mock<ILogger<BoreholeLockService>>().Object, timeProviderMock.Object);

        Assert.AreEqual(false, await boreholeLockService.IsBoreholeLockedAsync(borehole.Id, EditorUserName));
    }

    private Borehole GetLockedBorehole(bool lockedByEditor)
    {
        bool LockedCondition(Borehole borehole) => lockedByEditor ? borehole.LockedById == EditorUserId : borehole.LockedById != EditorUserId;

        return context
            .Boreholes
            .Include(b => b.Workflows)
            .Where(b => b.Workflows.Any(w => w.UserId == EditorUserId))
            .AsEnumerable()
            .First(b => b.Locked.HasValue && LockedCondition(b));
    }

    private static Mock<TimeProvider> CreateTimeProviderMock(DateTime fakeUtcDate)
    {
        var timeProviderMock = new Mock<TimeProvider>();
        timeProviderMock
            .Setup(x => x.GetUtcNow())
            .Returns(fakeUtcDate);

        return timeProviderMock;
    }
}