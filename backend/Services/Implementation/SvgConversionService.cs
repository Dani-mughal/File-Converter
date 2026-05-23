using Svg.Skia;
using SkiaSharp;
using Microsoft.Extensions.Logging;
using ConvertHub.Api.Services.Interfaces;
using ConvertHub.Api.Models;
using System.Diagnostics;

namespace ConvertHub.Api.Services.Implementation
{
    public class SvgConversionService : IConversionService
    {
        private readonly ILogger<SvgConversionService> _logger;
        private readonly IFileStorageService _storageService;

        public SvgConversionService(ILogger<SvgConversionService> logger, IFileStorageService storageService)
        {
            _logger = logger;
            _storageService = storageService;
        }

        public async Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType)
        {
            var ext = GetTempExtension(conversionType);
            var outputPath = Path.Combine(_storageService.GetTempDirectory(), $"{Guid.NewGuid()}{ext}");
            await ConvertSvgAsync(sourceFilePath, outputPath, conversionType);
            return outputPath;
        }

        public string GetOutputMimeType(ConversionType type)
        {
            return type switch
            {
                ConversionType.SvgToPng => "image/png",
                ConversionType.SvgToPdf => "application/pdf",
                ConversionType.SvgToWebp => "image/webp",
                ConversionType.SvgToIco => "image/x-icon",
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
                ConversionType.SvgToPng => ".png",
                ConversionType.SvgToPdf => ".pdf",
                ConversionType.SvgToWebp => ".webp",
                ConversionType.SvgToIco => ".ico",
                _ => ".jpg"
            };
        }

        public async Task ConvertSvgAsync(string sourcePath, string destPath, ConversionType conversionType)
        {
            var totalSw = Stopwatch.StartNew();
            _logger.LogInformation("[SVG SERVICE] Starting {Type}: {Src}", conversionType, sourcePath);

            try
            {
                // 1. Faster SVG parsing - Parse only once
                var parseSw = Stopwatch.StartNew();
                using var svg = new SKSvg();
                if (svg.Load(sourcePath) == null)
                {
                    throw new InvalidOperationException("Failed to load SVG file.");
                }
                parseSw.Stop();
                _logger.LogInformation("[SVG PERFORMANCE] Parsing time: {Ms}ms", parseSw.ElapsedMilliseconds);

                var renderSw = Stopwatch.StartNew();
                
                // Determine dimensions
                var svgWidth = svg.Picture?.CullRect.Width ?? 100;
                var svgHeight = svg.Picture?.CullRect.Height ?? 100;

                // Smart Default DPI (150-200) - For SVG, scale is more relevant
                // If it's too small, scale it up to a reasonable minimum (e.g. 1024px)
                float scale = 1.0f;
                if (svgWidth < 500 && svgHeight < 500)
                {
                    scale = Math.Max(1024f / svgWidth, 1024f / svgHeight);
                }

                int width = (int)(svgWidth * scale);
                int height = (int)(svgHeight * scale);

                if (conversionType == ConversionType.SvgToPdf)
                {
                    await ConvertToPdfAsync(svg, destPath, svgWidth, svgHeight);
                }
                else
                {
                    await ConvertToImageAsync(svg, destPath, conversionType, width, height, scale);
                }

                renderSw.Stop();
                totalSw.Stop();
                _logger.LogInformation("[SVG SERVICE DONE] Total time: {Ms}ms", totalSw.ElapsedMilliseconds);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error converting SVG for {Type}", conversionType);
                throw;
            }
        }

        private async Task ConvertToImageAsync(SKSvg svg, string destPath, ConversionType conversionType, int width, int height, float scale)
        {
            var renderSw = Stopwatch.StartNew();
            
            // 2. Faster rendering - optimize SkiaSharp pipeline
            using var bitmap = new SKBitmap(width, height);
            using (var canvas = new SKCanvas(bitmap))
            {
                canvas.Clear(SKColors.Transparent);
                canvas.Scale(scale);
                canvas.DrawPicture(svg.Picture);
            }
            renderSw.Stop();
            _logger.LogInformation("[SVG PERFORMANCE] Rendering time: {Ms}ms", renderSw.ElapsedMilliseconds);

            var encodeSw = Stopwatch.StartNew();
            using var image = SKImage.FromBitmap(bitmap);
            
            // 5. Encoding optimization
            SKEncodedImageFormat format = conversionType switch
            {
                ConversionType.SvgToPng => SKEncodedImageFormat.Png,
                ConversionType.SvgToWebp => SKEncodedImageFormat.Webp,
                ConversionType.SvgToIco => SKEncodedImageFormat.Png, // Render as PNG for ICO
                _ => SKEncodedImageFormat.Jpeg
            };

            int quality = conversionType switch
            {
                ConversionType.SvgToWebp => 80, // WebP speed/quality balance
                ConversionType.SvgToJpg => 90,
                _ => 100
            };

            using var data = image.Encode(format, quality);
            using var stream = File.OpenWrite(destPath);
            await data.AsStream().CopyToAsync(stream);
            
            encodeSw.Stop();
            _logger.LogInformation("[SVG PERFORMANCE] Encoding time: {Ms}ms", encodeSw.ElapsedMilliseconds);
        }

        private async Task ConvertToPdfAsync(SKSvg svg, string destPath, float width, float height)
        {
            await Task.Run(() => {
                var pdfSw = Stopwatch.StartNew();
                
                // 6. PDF optimization - Direct vector embedding
                using var stream = File.OpenWrite(destPath);
                using var document = SKDocument.CreatePdf(stream);
                
                // Auto-fit page dimensions to SVG content
                using var canvas = document.BeginPage(width, height);
                canvas.DrawPicture(svg.Picture);
                document.EndPage();
                document.Close();

                pdfSw.Stop();
                _logger.LogInformation("[SVG PERFORMANCE] PDF Generation time: {Ms}ms", pdfSw.ElapsedMilliseconds);
            });
        }
    }
}
