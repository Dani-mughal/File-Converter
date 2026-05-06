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
                ConversionType.WebpToPng or ConversionType.HeicToPng or ConversionType.SvgToPng 
                    or ConversionType.JfifToPng or ConversionType.AiToPng or ConversionType.PsdToPng 
                    or ConversionType.AvifToPng => "image/png",
                ConversionType.PngToSvg or ConversionType.AiToSvg or ConversionType.EpsToSvg => "image/svg+xml",
                ConversionType.PngToIco or ConversionType.SvgToIco => "image/x-icon",
                ConversionType.AiToPdf or ConversionType.EpsToPdf or ConversionType.SvgToPdf or ConversionType.PsdToPdf => "application/pdf",
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
                ConversionType.WebpToPng or ConversionType.HeicToPng or ConversionType.SvgToPng 
                    or ConversionType.JfifToPng or ConversionType.AiToPng or ConversionType.PsdToPng 
                    or ConversionType.AvifToPng => ".png",
                ConversionType.PngToSvg or ConversionType.AiToSvg or ConversionType.EpsToSvg => ".svg",
                ConversionType.PngToIco or ConversionType.SvgToIco => ".ico",
                ConversionType.AiToPdf or ConversionType.EpsToPdf or ConversionType.SvgToPdf or ConversionType.PsdToPdf => ".pdf",
                _ => ".jpg"
            };
        }

        public async Task ConvertImageAsync(string sourcePath, string destPath, ConversionType conversionType)
        {
            _logger.LogInformation("[IMAGE SERVICE] {Type}: {Src} → {Dst}", conversionType, sourcePath, destPath);
            await Task.Run(() =>
            {
                try
                {
                    var readSettings = new MagickReadSettings();
                    // Better quality for documents and vectors
                    if (conversionType == ConversionType.PdfToJpg || conversionType == ConversionType.SvgToPng 
                        || conversionType == ConversionType.AiToPng || conversionType == ConversionType.EpsToPng)
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
                        case ConversionType.JpgToPng:
                        case ConversionType.AiToPng:
                        case ConversionType.PsdToPng:
                        case ConversionType.AvifToPng:
                            image.Format = MagickFormat.Png;
                            break;

                        case ConversionType.WebpToJpg:
                        case ConversionType.HeicToJpg:
                        case ConversionType.PdfToJpg:
                        case ConversionType.PngToJpg:
                        case ConversionType.SvgToJpg:
                        case ConversionType.PsdToJpg:
                        case ConversionType.JfifToJpg:
                            image.Format = MagickFormat.Jpeg;
                            image.Quality = 90;
                            break;

                        case ConversionType.PngToWebp:
                        case ConversionType.JpgToWebp:
                        case ConversionType.SvgToWebp:
                        case ConversionType.PsdToWebp:
                            image.Format = MagickFormat.WebP;
                            break;

                        case ConversionType.PngToSvg:
                        case ConversionType.AiToSvg:
                        case ConversionType.EpsToSvg:
                            image.Format = MagickFormat.Svg;
                            break;

                        case ConversionType.PngToIco:
                        case ConversionType.SvgToIco:
                            image.Format = MagickFormat.Ico;
                            break;

                        case ConversionType.EpsToPdf:
                        case ConversionType.AiToPdf:
                        case ConversionType.PsdToPdf:
                        case ConversionType.SvgToPdf:
                        case ConversionType.HeicToPdf:
                        case ConversionType.TiffToPdf:
                        case ConversionType.JpgToPdf:
                        case ConversionType.PngToPdf:
                            image.Format = MagickFormat.Pdf;
                            break;

                        case ConversionType.ImageConverter:
                            var ext = Path.GetExtension(destPath)?.ToLowerInvariant();
                            image.Format = ext switch {
                                ".png" => MagickFormat.Png,
                                ".webp" => MagickFormat.WebP,
                                ".svg" => MagickFormat.Svg,
                                ".pdf" => MagickFormat.Pdf,
                                _ => MagickFormat.Jpeg
                            };
                            break;

                        default:
                            // Try to guess by extension if not explicitly handled but routed here
                            var destExt = Path.GetExtension(destPath)?.ToLowerInvariant();
                            if (destExt == ".png") image.Format = MagickFormat.Png;
                            else if (destExt == ".webp") image.Format = MagickFormat.WebP;
                            else if (destExt == ".pdf") image.Format = MagickFormat.Pdf;
                            else if (destExt == ".svg") image.Format = MagickFormat.Svg;
                            else image.Format = MagickFormat.Jpeg;
                            break;
                    }
                    
                    image.Strip();
                    image.Write(destPath);
                    _logger.LogInformation("[IMAGE SERVICE DONE] {Type}", conversionType);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error converting image for {conversionType}");
                    throw new InvalidOperationException($"Failed to convert image: {ex.Message}", ex);
                }
            });
        }
    }
}
