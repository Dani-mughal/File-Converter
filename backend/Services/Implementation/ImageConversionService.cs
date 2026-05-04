using ConvertHub.Api.Models;
using ImageMagick;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;
using System;

using ConvertHub.Api.Services.Interfaces;

namespace ConvertHub.Api.Services.Implementation
{
    public class ImageConversionService : IConversionService
    {
        private readonly ILogger<ImageConversionService> _logger;
        private readonly IFileStorageService _storageService;

        public ImageConversionService(ILogger<ImageConversionService> logger, IFileStorageService storageService)
        {
            _logger = logger;
            _storageService = storageService;
        }

        public async Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType)
        {
            var ext = GetTempExtension(conversionType);
            var outputPath = Path.Combine(_storageService.GetTempDirectory(), $"{Guid.NewGuid()}{ext}");
            await ConvertImageAsync(sourceFilePath, outputPath, conversionType);
            return outputPath;
        }

        public string GetOutputMimeType(ConversionType type)
        {
            return type switch
            {
                ConversionType.WebpToPng or ConversionType.HeicToPng or ConversionType.SvgToPng or ConversionType.JfifToPng => "image/png",
                _ => "image/jpeg"
            };
        }

        public string GetOutputFileName(string originalFileName, ConversionType type)
        {
            return $"{Path.GetFileNameWithoutExtension(originalFileName)}{GetTempExtension(type)}";
        }

        public ConversionType ParseConversionType(string typeStr) => ConversionType.Unknown;

        private string GetTempExtension(ConversionType type)
        {
            return type switch
            {
                ConversionType.WebpToPng or ConversionType.HeicToPng or ConversionType.SvgToPng or ConversionType.JfifToPng => ".png",
                ConversionType.PngToSvg => ".svg",
                _ => ".jpg"
            };
        }

        public async Task ConvertImageAsync(string sourcePath, string destPath, ConversionType conversionType)
        {
            await Task.Run(() =>
            {
                try
                {
                    // For PDF to Image, we need a special density setting
                    var readSettings = new MagickReadSettings();
                    if (conversionType == ConversionType.PdfToJpg || conversionType == ConversionType.DocumentToPdf)
                    {
                        readSettings.Density = new Density(300, 300);
                    }

                    using var image = new MagickImage(sourcePath, readSettings);
                    
                    switch (conversionType)
                    {
                        case ConversionType.WebpToPng:
                        case ConversionType.JfifToPng:
                        case ConversionType.HeicToPng:
                        case ConversionType.SvgToPng:
                            image.Format = MagickFormat.Png;
                            break;
                        case ConversionType.WebpToJpg:
                        case ConversionType.HeicToJpg:
                        case ConversionType.PdfToJpg:
                            image.Format = MagickFormat.Jpeg;
                            image.Quality = 90;
                            break;
                        case ConversionType.PngToSvg:
                            image.Format = MagickFormat.Svg;
                            break;
                        case ConversionType.ImageConverter:
                            // Best effort default based on extension
                            var ext = Path.GetExtension(destPath)?.ToLowerInvariant() ?? ".jpg";
                            image.Format = ext == ".png" ? MagickFormat.Png : MagickFormat.Jpeg;
                            break;
                        default:
                            throw new NotSupportedException($"Image conversion type {conversionType} is not fully supported yet.");
                    }
                    
                    image.Write(destPath);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error converting image for {conversionType}");
                    throw new InvalidOperationException($"Failed to convert image.", ex);
                }
            });
        }
    }
}
