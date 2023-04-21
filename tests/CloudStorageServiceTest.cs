﻿using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Minio;
using Minio.DataModel;
using Minio.Exceptions;
using System.Reactive.Linq;
using System.Text;
using static BDMS.Helpers;

namespace BDMS;

[TestClass]
public class CloudStorageServiceTest
{
    private MinioClient minioClient;
    private BdmsContext context;
    private CloudStorageService cloudStorageService;
    private IConfiguration configuration;

    [TestInitialize]
    public void TestInitialize()
    {
        var builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.development.json", optional: true, reloadOnChange: true);
        var configuration = builder.Build();

        context = ContextFactory.CreateContext();
        cloudStorageService = new CloudStorageService(configuration);

        this.configuration = configuration;

        minioClient = new MinioClient()
            .WithEndpoint(configuration.GetConnectionString("S3_ENDPOINT"))
            .WithCredentials(configuration.GetConnectionString("S3_ACCESS_KEY"), configuration.GetConnectionString("S3_SECRET_KEY"))
            .WithSSL(false)
            .Build();
    }

    [TestCleanup]
    public async Task TestCleanup()
    {
        await context.DisposeAsync();
    }

    [TestMethod]
    public async Task UploadObjectShouldStoreFileInCloudStorage()
    {
        // Create file to upload
        var pdfFormFile = GetFormFileByContent(Guid.NewGuid().ToString(), "file_1.pdf");

        // Upload file
        var result = await cloudStorageService.UploadObject(pdfFormFile, pdfFormFile.FileName);
        Assert.AreEqual(true, result);
    }

    [TestMethod]
    public async Task UploadObjectSameFileTwiceShouldReplaceFileInCloudStorage()
    {
        // Create file to upload
        var content = Guid.NewGuid().ToString();
        var pdfFormFile = GetFormFileByContent(content, "file_1.pdf");

        ListObjectsArgs listObjectsArgs = new ListObjectsArgs()
                    .WithBucket(configuration.GetConnectionString("S3_BUCKET_NAME"));

        // First Upload file
        await cloudStorageService.UploadObject(pdfFormFile, pdfFormFile.FileName);

        // List all objects in the bucket
        IObservable<Item> observable = minioClient.ListObjectsAsync(listObjectsArgs);

        // Get all files on storage with same key as uploaded file
        var files = await observable.Where(file => file.Key == pdfFormFile.FileName).ToList();
        Assert.AreEqual(1, files.Count);

        // Get upload date of file
        var uploadDate = files.First().LastModifiedDateTime;

        // Second Upload file
        await cloudStorageService.UploadObject(pdfFormFile, pdfFormFile.FileName);

        // List all objects in the bucket
        observable = minioClient.ListObjectsAsync(listObjectsArgs);

        // Get all files on storage with same key as uploaded file
        files = await observable.Where(file => file.Key == pdfFormFile.FileName).ToList();
        Assert.AreEqual(1, files.Count);

        // Check uploaded file was replaced
        Assert.AreNotEqual(uploadDate, files.First().LastModifiedDateTime);
    }

    [TestMethod]
    public async Task GetObjectWithNotExistingObjectNameShouldThrowException()
    {
        await Assert.ThrowsExceptionAsync<ObjectNotFoundException>(() => cloudStorageService.GetObject("doesNotExist"));
    }

    [TestMethod]
    public async Task GetObjectShouldReturnFileBytes()
    {
        // Create file to upload
        var content = Guid.NewGuid().ToString();
        var pdfFormFile = GetFormFileByContent(content, "file_1.pdf");

        // Upload file
        await cloudStorageService.UploadObject(pdfFormFile, pdfFormFile.FileName);

        // Download file
        var result = await cloudStorageService.GetObject(pdfFormFile.FileName);
        Assert.AreEqual(content, Encoding.UTF8.GetString(result));
    }

    [TestMethod]
    public async Task RemoveFile()
    {
        var client = new MinioClient()
            .WithEndpoint("localhost:9000")
            .WithCredentials("REDSQUIRREL", "YELLOWMONKEY")
            .WithSSL(false)
            .Build();

        StatObjectArgs statObjectArgs = new StatObjectArgs()
            .WithBucket("swissforages")
            .WithObject("empty_attachment.pdf");

        // If the file exists, delete it
        try
        {
            await client.StatObjectAsync(statObjectArgs).ConfigureAwait(false);
            await client.RemoveObjectAsync("swissforages", "empty_attachment.pdf");
            Console.WriteLine("File deleted successfully!");
        }
        catch (Minio.Exceptions.MinioException ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
