using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;

namespace ConvertHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConvertController : ControllerBase
    {
        private readonly IConversionService _pdfService;
        private readonly Services.Implementation.ImageConversionService _imageService;
        private readonly Services.Implementation.MediaConversionService _mediaService;
        private readonly Services.Implementation.TextDataConversionService _textService;
        private readonly IFileStorageService _storageService;

        public ConvertController(
            IConversionService pdfService,
            Services.Implementation.ImageConversionService imageService,
            Services.Implementation.MediaConversionService mediaService,
            Services.Implementation.TextDataConversionService textService,
            IFileStorageService storageService)
        {
            _pdfService = pdfService;
            _imageService = imageService;
            _mediaService = mediaService;
            _textService = textService;
            _storageService = storageService;
        }

        [HttpPost]
        public async Task<IActionResult> Convert([FromForm] List<IFormFile> files, [FromForm] string targetFormat)
        {
            if (files == null || files.Count == 0)
                return BadRequest(new { message = "No files uploaded." });

            if (string.IsNullOrEmpty(targetFormat))
                return BadRequest(new { message = "Target format is required." });

            try
            {
                // Handle Multi-file ZIP creation
                if (targetFormat.ToLower() == "zip" && files.Count > 1)
                {
                    return await HandleZipCreation(files);
                }

                // Handle single file conversion
                var file = files[0];
                var sourcePath = await _storageService.SaveFileAsync(file);
                var extension = Path.GetExtension(file.FileName).ToLower().TrimStart('.');

                // Special handling for Unzip
                if (extension == "zip" && targetFormat.ToLower() == "unzip")
                {
                    return await HandleUnzip(sourcePath, file.FileName);
                }

                // Determine Conversion Type
                var conversionType = MapToConversionType(extension, targetFormat);
                if (conversionType == ConversionType.Unknown)
                {
                    return BadRequest(new { message = $"Conversion from {extension} to {targetFormat} is not supported." });
                }

                // Execute Conversion
                string outputPath;
                if (IsPdfService(conversionType))
                    outputPath = await _pdfService.ConvertAsync(sourcePath, conversionType);
                else if (IsImageService(conversionType))
                    outputPath = await _imageService.ConvertAsync(sourcePath, conversionType);
                else if (IsMediaService(conversionType))
                    outputPath = await _mediaService.ConvertAsync(sourcePath, conversionType);
                else
                    outputPath = await _textService.ConvertAsync(sourcePath, conversionType);

                if (string.IsNullOrEmpty(outputPath) || !System.IO.File.Exists(outputPath))
                    throw new Exception("Conversion failed to produce output.");

                var bytes = await System.IO.File.ReadAllBytesAsync(outputPath);
                var mimeType = GetMimeType(targetFormat);
                var fileName = Path.GetFileName(outputPath);

                // Cleanup
                _storageService.DeleteFile(sourcePath);
                System.IO.File.Delete(outputPath);

                return File(bytes, mimeType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private async Task<IActionResult> HandleZipCreation(List<IFormFile> files)
        {
            var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            Directory.CreateDirectory(tempDir);
            var zipPath = Path.Combine(Path.GetTempPath(), $"archive_{Guid.NewGuid()}.zip");

            try
            {
                using (var archive = ZipFile.Open(zipPath, ZipArchiveMode.Create))
                {
                    foreach (var file in files)
                    {
                        var filePath = Path.Combine(tempDir, file.FileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                        archive.CreateEntryFromFile(filePath, file.FileName);
                    }
                }

                var bytes = await System.IO.File.ReadAllBytesAsync(zipPath);
                return File(bytes, "application/zip", "converted_files.zip");
            }
            finally
            {
                if (Directory.Exists(tempDir)) Directory.Delete(tempDir, true);
                if (System.IO.File.Exists(zipPath)) System.IO.File.Delete(zipPath);
            }
        }

        private async Task<IActionResult> HandleUnzip(string zipPath, string originalName)
        {
            var extractDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            Directory.CreateDirectory(extractDir);
            var outZipPath = Path.Combine(Path.GetTempPath(), $"extracted_{Guid.NewGuid()}.zip");

            try
            {
                ZipFile.ExtractToDirectory(zipPath, extractDir);
                ZipFile.CreateFromDirectory(extractDir, outZipPath); // Just re-zip for simplicity or return a single file if it was one

                var bytes = await System.IO.File.ReadAllBytesAsync(outZipPath);
                return File(bytes, "application/zip", $"extracted_{Path.GetFileNameWithoutExtension(originalName)}.zip");
            }
            finally
            {
                if (Directory.Exists(extractDir)) Directory.Delete(extractDir, true);
                if (System.IO.File.Exists(outZipPath)) System.IO.File.Delete(outZipPath);
                if (System.IO.File.Exists(zipPath)) System.IO.File.Delete(zipPath);
            }
        }

        private ConversionType MapToConversionType(string src, string target)
        {
            src = src.ToLower();
            target = target.ToLower();

            if (src == "pdf" && target == "docx") return ConversionType.PdfToWord;
            if (src == "pdf" && target == "xlsx") return ConversionType.PdfToExcel;
            if (src == "pdf" && target == "jpg") return ConversionType.PdfToJpg;
            if (src == "pdf" && target == "epub") return ConversionType.PdfToEpub;
            if (src == "docx" && target == "pdf") return ConversionType.DocxToPdf;
            if (src == "doc" && target == "pdf") return ConversionType.WordToPdf;
            if (src == "epub" && target == "pdf") return ConversionType.EpubToPdf;
            if (src == "jpg" && target == "pdf") return ConversionType.JpgToPdf;
            if (src == "png" && target == "pdf") return ConversionType.ImageToPdf;
            if (src == "xlsx" && target == "pdf") return ConversionType.ExcelToPdf;
            if (src == "pptx" && target == "pdf") return ConversionType.PptToPdf;

            if (src == "webp" && target == "png") return ConversionType.WebpToPng;
            if (src == "webp" && target == "jpg") return ConversionType.WebpToJpg;
            if (src == "png" && target == "svg") return ConversionType.PngToSvg;
            
            if (src == "mp4" && target == "mp3") return ConversionType.Mp4ToMp3;
            if (src == "mp4" && target == "gif") return ConversionType.Mp4ToGif;
            
            if (src == "json" && target == "csv") return ConversionType.JsonToCsv;
            if (src == "csv" && target == "json") return ConversionType.JsonToCsv; // Handled by service
            if (src == "xml" && target == "json") return ConversionType.XmlToJson;
            if (src == "md" && target == "html") return ConversionType.MarkdownToHtml;

            return ConversionType.Unknown;
        }

        private bool IsPdfService(ConversionType type) => type.ToString().StartsWith("Pdf") || type.ToString().EndsWith("Pdf");
        private bool IsImageService(ConversionType type) => type.ToString().Contains("Webp") || type.ToString().Contains("Png") || type.ToString().Contains("Jfif");
        private bool IsMediaService(ConversionType type) => type.ToString().Contains("Mp4") || type.ToString().Contains("Video") || type.ToString().Contains("Audio") || type.ToString().Contains("Gif");

        private string GetMimeType(string ext)
        {
            return ext.ToLower() switch
            {
                "pdf" => "application/pdf",
                "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "jpg" or "jpeg" => "image/jpeg",
                "png" => "image/png",
                "zip" => "application/zip",
                "mp3" => "audio/mpeg",
                "gif" => "image/gif",
                "txt" => "text/plain",
                "html" => "text/html",
                "csv" => "text/csv",
                "json" => "application/json",
                _ => "application/octet-stream"
            };
        }
    }
}
