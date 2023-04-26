﻿using BDMS.Models;
using Minio;
using Minio.Exceptions;
using System.Security.Cryptography;

namespace BDMS;

/// <summary>
/// Represents a service to upload borehole files to the cloud storage.
/// </summary>
public class BoreholeFileUploadService
{
    private readonly BdmsContext context;
    private readonly ILogger logger;
    private readonly string bucketName;
    private readonly string endpoint;
    private readonly string accessKey;
    private readonly string secretKey;

    public BoreholeFileUploadService(BdmsContext context, IConfiguration configuration, ILogger<BoreholeFileUploadService> logger)
    {
        this.logger = logger;
        this.context = context;
        bucketName = configuration["S3:BUCKET_NAME"];
        endpoint = configuration["S3:ENDPOINT"];
        accessKey = configuration["S3:ACCESS_KEY"];
        secretKey = configuration["S3:SECRET_KEY"];
    }

    /// <summary>
    /// Uploads a file to the cloud storage and links it to the borehole.
    /// </summary>
    /// <param name="file">The file to upload and link to the <see cref="Borehole"/>.</param>
    /// <param name="boreholeId">The <see cref="Borehole.Id"/> to link the uploaded <paramref name="file"/> to.</param>
    public async Task UploadFileAndLinkToBorehole(IFormFile file, int boreholeId)
    {
        // Generate a hash based on the file content.
        var base64Hash = "";
        using (SHA256 sha256Hash = SHA256.Create())
        {
            using Stream stream = file.OpenReadStream();
            byte[] hashBytes = sha256Hash.ComputeHash(stream);
            base64Hash = Convert.ToBase64String(hashBytes);
        }

        // Check any file with the same hash already exists in the database.
        var fileId = context.Files.FirstOrDefault(f => f.Hash == base64Hash)?.Id;

        // Create a transaction to ensure the file is only linked to the borehole if it is successfully uploaded.
        using var transaction = context.Database.BeginTransaction();
        try
        {
            // If file does not exist on storage, upload it and create file in database.
            if (fileId == null)
            {
                var fileExtension = Path.GetExtension(file.FileName);
                var fileNameGuid = $"{Guid.NewGuid()}{fileExtension}";

                var bdmsFile = new Models.File { Name = file.FileName, NameUuid = fileNameGuid, Hash = base64Hash, Type = file.ContentType, };

                await context.Files.AddAsync(bdmsFile).ConfigureAwait(false);
                await context.SaveChangesAsync().ConfigureAwait(false);

                fileId = bdmsFile.Id;

                try
                {
                    // Upload the file to the cloud storage.
                    await UploadObject(file, fileNameGuid).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error uploading file <{file.FileName}> (with GUID {fileNameGuid}) to cloud storage.");
                    throw;
                }
            }

            // Link file to the borehole.
            if (!context.BoreholeFiles.Any(bf => bf.BoreholeId == boreholeId && bf.FileId == fileId))
            {
                var boreHolefile = new BoreholeFile { FileId = (int)fileId, BoreholeId = boreholeId, };

                await context.BoreholeFiles.AddAsync(boreHolefile).ConfigureAwait(false);
                await context.SaveChangesAsync().ConfigureAwait(false);
            }

            await transaction.CommitAsync().ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error attaching file <{file.FileName}> to borehole with Id <{boreholeId}>.");
            throw;
        }
    }

    /// <summary>
    /// Uploads a file to the cloud storage.
    /// </summary>
    /// <param name="file">The file to upload.</param>
    /// <param name="objectName">The name of the file in the storage.</param>
    internal async Task UploadObject(IFormFile file, string objectName)
    {
        using var initClient = new MinioClient();
        using MinioClient minioClient = initClient.WithEndpoint(endpoint).WithCredentials(accessKey, secretKey).WithSSL(false).Build();
        try
        {
            // Create bucket if it doesn't exist.
            var bucketExistsArgs = new BucketExistsArgs().WithBucket(bucketName);
            if (await minioClient.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false) == false)
            {
                var bucketMakeArgs = new MakeBucketArgs().WithBucket(bucketName);
                await minioClient.MakeBucketAsync(bucketMakeArgs).ConfigureAwait(false);
            }

            // Get the content type and create a stream from the uploaded file.
            var contentType = file.ContentType;

            using var stream = file.OpenReadStream();

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(file.Length)
                .WithContentType(contentType);

            // Upload the stream to the bucket.
            await minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error uploading file <{file.FileName}> to cloud storage.");
            throw;
        }
    }

    /// <summary>
    /// Gets a file from the cloud storage.
    /// </summary>
    /// <param name="objectName">The name of the file in the bucket.</param>
    public async Task<byte[]> GetObject(string objectName)
    {
        using var initClient = new MinioClient();
        using MinioClient minioClient = initClient.WithEndpoint(endpoint).WithCredentials(accessKey, secretKey).WithSSL(false).Build();
        try
        {
            using var downloadStream = new MemoryStream();

            var getObjectArgs = new GetObjectArgs().WithBucket(bucketName).WithObject(objectName).WithCallbackStream(stream => stream.CopyTo(downloadStream));

            await minioClient.GetObjectAsync(getObjectArgs).ConfigureAwait(false);

            return downloadStream.ToArray();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error downloading file <{objectName}> from cloud storage.");
            if (ex.Message.Contains("Not found", StringComparison.OrdinalIgnoreCase))
            {
                throw new ObjectNotFoundException(objectName, $"Object <{objectName}> not found on storage.");
            }

            throw;
        }
    }

    /// <summary>
    /// Deletes a file from the cloud storage.
    /// </summary>
    /// <param name="objectName">The name of the file in the bucket to delete.</param>
    public async Task DeleteObject(string objectName)
    {
        using var initClient = new MinioClient();
        using MinioClient minioClient = initClient.WithEndpoint(endpoint).WithCredentials(accessKey, secretKey).WithSSL(false).Build();
        try
        {
            var removeObjectArgs = new RemoveObjectArgs().WithBucket(bucketName).WithObject(objectName);

            await minioClient.RemoveObjectAsync(removeObjectArgs).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error deleting file <{objectName}> from cloud storage.");
            if (ex.Message.Contains("Not found", StringComparison.OrdinalIgnoreCase))
            {
                throw new ObjectNotFoundException(objectName, $"Object <{objectName}> not found on storage.");
            }

            throw;
        }
    }
}
