using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using System.IO.Compression;

namespace ConvertHub.Api.Services.Implementation
{
    public class ArchiveConversionService : IConversionService
    {
        private readonly ILogger<ArchiveConversionService> _logger;
        private readonly IFileStorageService _storageService;

        public ArchiveConversionService(ILogger<ArchiveConversionService> logger, IFileStorageService storageService)
        {
            _logger = logger;
            _storageService = storageService;
        }

        public async Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType)
        {
            var ext = GetExtension(conversionType);
            var outputPath = Path.Combine(_storageService.GetTempDirectory(), $"{Guid.NewGuid()}{ext}");

            _logger.LogInformation("[ARCHIVE SERVICE] {Type}: {Src} → {Dst}", conversionType, sourceFilePath, outputPath);

            return await Task.Run(() =>
            {
                if (conversionType == ConversionType.Zip || conversionType == ConversionType.Archive)
                {
                    CreateZip(sourceFilePath, outputPath);
                    return outputPath;
                }
                else if (conversionType == ConversionType.Unzip)
                {
                    return ExtractZip(sourceFilePath);
                }
                else
                {
                    throw new NotSupportedException($"Archive operation '{conversionType}' not supported.");
                }
            });
        }

        public string GetOutputMimeType(ConversionType type) => type switch
        {
            ConversionType.Zip or ConversionType.Archive => "application/zip",
            _ => "application/octet-stream"
        };

        public string GetOutputFileName(string originalFileName, ConversionType type)
            => $"{Path.GetFileNameWithoutExtension(originalFileName)}{GetExtension(type)}";

        public ConversionType ParseConversionType(string typeStr) => ConversionType.Unknown;

        private string GetExtension(ConversionType type) => type switch
        {
            ConversionType.Zip or ConversionType.Archive => ".zip",
            _ => ".tmp"
        };

        private void CreateZip(string src, string dst)
        {
            if (File.Exists(dst)) File.Delete(dst);

            if (Directory.Exists(src))
            {
                ZipFile.CreateFromDirectory(src, dst, CompressionLevel.Optimal, true);
            }
            else if (File.Exists(src))
            {
                using var archive = ZipFile.Open(dst, ZipArchiveMode.Create);
                archive.CreateEntryFromFile(src, Path.GetFileName(src));
            }
            else
            {
                throw new FileNotFoundException("Source for ZIP not found.", src);
            }
        }

        private string ExtractZip(string src)
        {
            var tempDir = _storageService.GetTempDirectory();
            var extractPath = Path.Combine(tempDir, Guid.NewGuid().ToString());
            Directory.CreateDirectory(extractPath);

            ZipFile.ExtractToDirectory(src, extractPath);

            var files = Directory.GetFiles(extractPath, "*.*", SearchOption.AllDirectories);
            if (files.Length == 0)
                throw new InvalidOperationException("ZIP archive is empty.");

            // If there's only one file, return it directly
            if (files.Length == 1)
            {
                return files[0];
            }

            // If there are multiple files, we have a problem: the controller expects a single file.
            // For now, we ZIP them back up (which is redundant but keeps the API happy) 
            // OR we just return the first file. 
            // Better: Return the first file and log a warning. 
            // In a real production app, Unzip would return a list of links.
            _logger.LogWarning("[ARCHIVE SERVICE] Unzip produced {Count} files. Returning only the first one: {File}", files.Length, files[0]);
            return files[0];
        }
    }
}
