using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using ConvertHub.Api.Services.Implementation;
using Microsoft.AspNetCore.Mvc;

namespace ConvertHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConvertController : ControllerBase
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IFileStorageService _storageService;
        private readonly JobManager _jobManager;
        private readonly ILogger<ConvertController> _logger;

        public ConvertController(
            IServiceScopeFactory scopeFactory,
            IFileStorageService storageService,
            JobManager jobManager,
            ILogger<ConvertController> logger)
        {
            _scopeFactory = scopeFactory;
            _storageService = storageService;
            _jobManager = jobManager;
            _logger = logger;
        }

        // GET /api/convert/health
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
        }

        // POST /api/convert/upload
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("Upload attempt with no file.");
                return BadRequest(new { success = false, error = "No file uploaded." });
            }

            _logger.LogInformation("[UPLOAD STARTED] {FileName} ({Size} bytes)", file.FileName, file.Length);

            try
            {
                var path = await _storageService.SaveFileAsync(file);
                _logger.LogInformation("[UPLOAD COMPLETE] Saved to {Path}", path);
                return Ok(new { success = true, filePath = path, fileName = file.FileName });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[UPLOAD FAILED] {FileName}", file.FileName);
                return StatusCode(500, new { success = false, error = $"Upload failed: {ex.Message}" });
            }
        }

        // POST /api/convert  — start a conversion job
        [HttpPost]
        public async Task<IActionResult> StartConversion(
            [FromForm] string filePath,
            [FromForm] string targetFormat,
            [FromForm] string originalFileName)
        {
            _logger.LogInformation("[CONVERSION STARTED] {OriginalFileName} → {TargetFormat}", originalFileName, targetFormat);

            if (string.IsNullOrWhiteSpace(filePath))
                return BadRequest(new { success = false, error = "filePath is required." });

            if (!System.IO.File.Exists(filePath))
            {
                _logger.LogError("[CONVERSION FAILED] Source file does not exist: {FilePath}", filePath);
                return BadRequest(new { success = false, error = "Uploaded file not found on server. Please re-upload." });
            }

            if (string.IsNullOrWhiteSpace(targetFormat))
                return BadRequest(new { success = false, error = "targetFormat is required." });

            if (string.IsNullOrWhiteSpace(originalFileName))
                return BadRequest(new { success = false, error = "originalFileName is required." });

            var extension = Path.GetExtension(originalFileName).ToLowerInvariant().TrimStart('.');
            var conversionType = MapToConversionType(extension, targetFormat.ToLowerInvariant().Trim());

            if (conversionType == ConversionType.Unknown)
            {
                _logger.LogWarning("[CONVERSION UNSUPPORTED] {Src} → {Tgt}", extension, targetFormat);
                return BadRequest(new { success = false, error = $"Conversion from '{extension}' to '{targetFormat}' is not supported." });
            }

            var jobId = _jobManager.CreateJob(originalFileName, conversionType);
            _logger.LogInformation("[JOB CREATED] JobId={JobId} Type={Type}", jobId, conversionType);

            // Run conversion in background — fire and forget but tracked via JobManager
            _ = Task.Run(async () =>
            {
                using var scope = _scopeFactory.CreateScope();
                var factory = scope.ServiceProvider.GetRequiredService<IConversionFactory>();

                try
                {
                    _jobManager.UpdateJob(jobId, j => { j.State = JobState.Processing; j.Progress = 10; });
                    _logger.LogInformation("[JOB PROCESSING] JobId={JobId}", jobId);

                    var service = factory.GetService(conversionType);
                    _logger.LogInformation("[COMMAND EXECUTING] JobId={JobId} Service={Service}", jobId, service.GetType().Name);

                    var outputPath = await service.ConvertAsync(filePath, conversionType);

                    if (!System.IO.File.Exists(outputPath))
                        throw new FileNotFoundException($"Converter ran but output file was not created at {outputPath}");

                    _logger.LogInformation("[OUTPUT CREATED] JobId={JobId} Output={Output}", jobId, outputPath);

                    _jobManager.UpdateJob(jobId, j =>
                    {
                        j.State = JobState.Completed;
                        j.Progress = 100;
                        j.OutputPath = outputPath;
                        j.CompletedAt = DateTime.UtcNow;
                    });

                    _logger.LogInformation("[DOWNLOAD READY] JobId={JobId}", jobId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[JOB FAILED] JobId={JobId} Error={Error}", jobId, ex.Message);
                    _jobManager.UpdateJob(jobId, j =>
                    {
                        j.State = JobState.Failed;
                        j.Progress = 0;
                        j.ErrorMessage = ex.Message;
                        j.CompletedAt = DateTime.UtcNow;
                    });
                }
            });

            return Ok(new { success = true, jobId });
        }

        // GET /api/convert/status/{jobId}
        [HttpGet("status/{jobId}")]
        public IActionResult GetStatus(string jobId)
        {
            var job = _jobManager.GetJob(jobId);
            if (job == null)
                return NotFound(new { success = false, error = "Job not found." });

            return Ok(job);
        }

        // GET /api/convert/download/{jobId}
        [HttpGet("download/{jobId}")]
        public async Task<IActionResult> Download(string jobId)
        {
            var job = _jobManager.GetJob(jobId);
            if (job == null)
                return NotFound(new { success = false, error = "Job not found." });

            if (job.State != JobState.Completed)
                return BadRequest(new { success = false, error = $"Job is not ready. Current state: {job.State}" });

            if (string.IsNullOrEmpty(job.OutputPath) || !System.IO.File.Exists(job.OutputPath))
            {
                _logger.LogError("[DOWNLOAD FAILED] Output file missing for JobId={JobId} Path={Path}", jobId, job.OutputPath);
                return NotFound(new { success = false, error = "Output file not found on server." });
            }

            _logger.LogInformation("[DOWNLOAD STARTED] JobId={JobId} File={File}", jobId, job.OutputPath);

            var bytes = await System.IO.File.ReadAllBytesAsync(job.OutputPath);
            var ext = Path.GetExtension(job.OutputPath).TrimStart('.').ToLower();
            var mimeType = GetMimeType(ext);
            var downloadName = Path.GetFileName(job.OutputPath);

            _logger.LogInformation("[DOWNLOAD COMPLETE] JobId={JobId} Size={Size} bytes", jobId, bytes.Length);
            return File(bytes, mimeType, downloadName);
        }

        // DELETE /api/convert/cleanup/{jobId}
        [HttpDelete("cleanup/{jobId}")]
        public IActionResult Cleanup(string jobId)
        {
            var job = _jobManager.GetJob(jobId);
            if (job == null)
                return NotFound(new { success = false, error = "Job not found." });

            // Delete output file
            if (!string.IsNullOrEmpty(job.OutputPath) && System.IO.File.Exists(job.OutputPath))
            {
                System.IO.File.Delete(job.OutputPath);
                _logger.LogInformation("[CLEANUP COMPLETE] Deleted output file for JobId={JobId}", jobId);
            }

            return Ok(new { success = true, message = "Files cleaned up." });
        }

        // ─── Conversion Type Mapping ─────────────────────────────────────────

        // Master dictionary: (sourceExt, targetExt) → ConversionType
        private static readonly Dictionary<(string, string), ConversionType> _conversionMap = new()
        {
            // Documents
            { ("pdf", "docx"),  ConversionType.PdfToDocx },
            { ("pdf", "word"),  ConversionType.PdfToWord },
            { ("pdf", "doc"),   ConversionType.PdfToWord },
            { ("pdf", "txt"),   ConversionType.PdfToTxt },
            { ("pdf", "html"),  ConversionType.PdfToHtml },
            { ("pdf", "epub"),  ConversionType.PdfToEpub },
            { ("pdf", "pptx"),  ConversionType.PdfToPptx },
            { ("pdf", "xlsx"),  ConversionType.PdfToXlsx },
            { ("pdf", "jpg"),   ConversionType.PdfToJpg },
            { ("pdf", "jpeg"),  ConversionType.PdfToJpg },
            { ("pdf", "png"),   ConversionType.PdfToJpg },
            { ("docx", "pdf"),  ConversionType.DocxToPdf },
            { ("doc", "pdf"),   ConversionType.DocToPdf },
            { ("doc", "txt"),   ConversionType.DocToTxt },
            { ("doc", "html"),  ConversionType.DocToHtml },
            { ("txt", "pdf"),   ConversionType.TxtToPdf },
            { ("txt", "docx"),  ConversionType.TxtToDocx },
            { ("txt", "html"),  ConversionType.TxtToHtml },
            { ("txt", "epub"),  ConversionType.TxtToEpub },
            { ("pptx", "pdf"),  ConversionType.PptxToPdf },
            { ("ppt", "pdf"),   ConversionType.PptToPdf },
            { ("ppt", "jpg"),   ConversionType.PptToJpg },
            { ("ppt", "png"),   ConversionType.PptToPng },
            { ("xlsx", "pdf"),  ConversionType.XlsxToPdf },
            { ("xls", "pdf"),   ConversionType.XlsToPdf },
            { ("xlsx", "csv"),  ConversionType.XlsxToCsv },
            { ("xls", "csv"),   ConversionType.XlsToCsv },
            { ("xlsx", "json"), ConversionType.XlsxToJson },
            { ("xls", "json"),  ConversionType.XlsToJson },
            { ("html", "pdf"),  ConversionType.HtmlToPdf },
            { ("html", "docx"), ConversionType.HtmlToDocx },
            { ("html", "md"),   ConversionType.HtmlToMarkdown },
            { ("epub", "pdf"),  ConversionType.EpubToPdf },

            // Archives
            { ("any", "zip"),   ConversionType.Zip },
            { ("zip", "unzip"), ConversionType.Unzip },
            { ("zip", "rar"),   ConversionType.ZipToRar },
            { ("rar", "zip"),   ConversionType.RarToZip },
            { ("7z", "zip"),    ConversionType.SevenZipToZip },
            { ("zip", "7z"),    ConversionType.ZipTo7z },
            { ("tar", "gz"),    ConversionType.TarToGz },

            // Images
            { ("jpg", "png"),   ConversionType.JpgToPng },
            { ("jpeg", "png"),  ConversionType.JpgToPng },
            { ("png", "jpg"),   ConversionType.PngToJpg },
            { ("png", "jpeg"),  ConversionType.PngToJpg },
            { ("jpg", "webp"),  ConversionType.JpgToWebp },
            { ("jpeg", "webp"), ConversionType.JpgToWebp },
            { ("png", "webp"),  ConversionType.PngToWebp },
            { ("webp", "jpg"),  ConversionType.WebpToJpg },
            { ("webp", "jpeg"), ConversionType.WebpToJpg },
            { ("webp", "png"),  ConversionType.WebpToPng },
            { ("jpg", "bmp"),   ConversionType.JpgToBmp },
            { ("bmp", "jpg"),   ConversionType.BmpToJpg },
            { ("bmp", "png"),   ConversionType.BmpToPng },
            { ("jpg", "tiff"),  ConversionType.JpgToTiff },
            { ("tiff", "jpg"),  ConversionType.TiffToJpg },
            { ("jpg", "gif"),   ConversionType.JpgToGif },
            { ("gif", "jpg"),   ConversionType.GifToJpg },
            { ("png", "svg"),   ConversionType.PngToSvg },
            { ("svg", "png"),   ConversionType.SvgToPng },
            { ("svg", "jpg"),   ConversionType.SvgToJpg },
            { ("svg", "jpeg"),  ConversionType.SvgToJpg },
            { ("svg", "pdf"),   ConversionType.SvgToPdf },
            { ("svg", "webp"),  ConversionType.SvgToWebp },
            { ("png", "ico"),   ConversionType.PngToIco },
            { ("ico", "png"),   ConversionType.IcoToPng },
            { ("png", "pdf"),   ConversionType.PngToPdf },
            { ("heic", "jpg"),  ConversionType.HeicToJpg },
            { ("heic", "jpeg"), ConversionType.HeicToJpg },
            { ("heic", "png"),  ConversionType.HeicToPng },
            { ("heic", "pdf"),  ConversionType.HeicToPdf },
            { ("avif", "png"),  ConversionType.AvifToPng },
            { ("jfif", "png"),  ConversionType.JfifToPng },
            { ("jfif", "jpg"),  ConversionType.JpgToPng },
            { ("psd", "jpg"),   ConversionType.PsdToJpg },
            { ("psd", "png"),   ConversionType.PsdToPng },
            { ("psd", "webp"),  ConversionType.PsdToWebp },
            { ("psd", "pdf"),   ConversionType.PsdToPdf },
            { ("eps", "svg"),   ConversionType.EpsToSvg },
            { ("eps", "pdf"),   ConversionType.EpsToPdf },
            { ("eps", "png"),   ConversionType.EpsToPng },
            { ("ai", "svg"),    ConversionType.AiToSvg },
            { ("ai", "pdf"),    ConversionType.AiToPdf },
            { ("ai", "png"),    ConversionType.AiToPng },
            { ("tiff", "pdf"),  ConversionType.TiffToPdf },
            { ("jpg", "pdf"),   ConversionType.JpgToPdf },
            { ("jpeg", "pdf"),  ConversionType.JpgToPdf },

            // Audio
            { ("mp3", "wav"),   ConversionType.Mp3ToWav },
            { ("wav", "mp3"),   ConversionType.WavToMp3 },
            { ("mp3", "aac"),   ConversionType.Mp3ToAac },
            { ("aac", "mp3"),   ConversionType.AacToMp3 },
            { ("mp3", "ogg"),   ConversionType.Mp3ToOgg },
            { ("ogg", "mp3"),   ConversionType.OggToMp3 },
            { ("mp3", "flac"),  ConversionType.Mp3ToFlac },
            { ("flac", "mp3"),  ConversionType.FlacToMp3 },
            { ("wav", "flac"),  ConversionType.WavToFlac },
            { ("wav", "aac"),   ConversionType.WavToAac },
            { ("m4a", "mp3"),   ConversionType.M4aToMp3 },
            { ("wma", "mp3"),   ConversionType.WmaToMp3 },

            // Video
            { ("mp4", "mp3"),   ConversionType.Mp4ToMp3 },
            { ("mov", "mp3"),   ConversionType.VideoToMp3 },
            { ("avi", "mp3"),   ConversionType.VideoToMp3 },
            { ("mkv", "mp3"),   ConversionType.VideoToMp3 },
            { ("webm", "mp3"),  ConversionType.VideoToMp3 },
            { ("mp4", "avi"),   ConversionType.Mp4ToAvi },
            { ("mp4", "mov"),   ConversionType.Mp4ToMov },
            { ("mp4", "mkv"),   ConversionType.Mp4ToMkv },
            { ("mp4", "webm"),  ConversionType.Mp4ToWebm },
            { ("mp4", "gif"),   ConversionType.Mp4ToGif },
            { ("webm", "gif"),  ConversionType.WebmToGif },
            { ("avi", "mp4"),   ConversionType.AviToMp4 },
            { ("mov", "mp4"),   ConversionType.MovToMp4 },
            { ("mkv", "mp4"),   ConversionType.MkvToMp4 },
            { ("webm", "mp4"),  ConversionType.WebmToMp4 },
            { ("flv", "mp4"),   ConversionType.FlvToMp4 },
            { ("wmv", "mp4"),   ConversionType.WmvToMp4 },
            { ("3gp", "mp4"),   ConversionType.ThreeGpToMp4 },
            { ("m4v", "mp4"),   ConversionType.M4vToMp4 },
            { ("gif", "mp4"),   ConversionType.GifToMp4 },
            { ("avi", "gif"),   ConversionType.AviToGif },
            { ("mov", "gif"),   ConversionType.MovToGif },

            // Text/Code/Data
            { ("json", "csv"),  ConversionType.JsonToCsv },
            { ("csv", "json"),  ConversionType.CsvToJson },
            { ("xml", "json"),  ConversionType.XmlToJson },
            { ("json", "xml"),  ConversionType.JsonToXml },
            { ("md", "html"),   ConversionType.MarkdownToHtml },
            { ("markdown", "html"), ConversionType.MarkdownToHtml },
            { ("json", "yaml"), ConversionType.JsonToYaml },
            { ("yaml", "json"), ConversionType.YamlToJson },
            { ("yml", "json"),  ConversionType.YamlToJson },
            { ("css", "min"),   ConversionType.CssMin },
            { ("js", "pretty"), ConversionType.JsBeautify },

            // Ebooks
            { ("epub", "mobi"), ConversionType.EpubToMobi },
            { ("mobi", "epub"), ConversionType.MobiToEpub },
            { ("epub", "txt"),  ConversionType.EpubToTxt },
            { ("epub", "docx"), ConversionType.EpubToDocx },
            { ("djvu", "pdf"),  ConversionType.DjvuToPdf },
        };

        private ConversionType MapToConversionType(string src, string target)
        {
            src = src.ToLowerInvariant().Trim();
            target = target.ToLowerInvariant().Trim();

            // Direct lookup
            if (_conversionMap.TryGetValue((src, target), out var ct))
                return ct;

            // Try enum-name construction as fallback e.g. "JpgToPng"
            var enumName = $"{char.ToUpper(src[0])}{src[1..]}To{char.ToUpper(target[0])}{target[1..]}";
            if (Enum.TryParse<ConversionType>(enumName, true, out var parsed) && parsed != ConversionType.Unknown)
                return parsed;

            // Final fallback for media if target is a standard media format
            if (IsVideoExtension(target)) return ConversionType.VideoConverter;
            if (IsAudioExtension(target)) return ConversionType.AudioConverter;

            return ConversionType.Unknown;
        }

        private bool IsVideoExtension(string ext) => ext switch {
            "mp4" or "avi" or "mov" or "mkv" or "webm" or "flv" or "wmv" or "3gp" or "m4v" or "mpg" or "mpeg" => true,
            _ => false
        };

        private bool IsAudioExtension(string ext) => ext switch {
            "mp3" or "wav" or "aac" or "ogg" or "flac" or "m4a" or "wma" or "aiff" or "alac" => true,
            _ => false
        };

        private static string GetMimeType(string ext) => ext.ToLowerInvariant() switch
        {
            "pdf"  => "application/pdf",
            "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "doc"  => "application/msword",
            "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "xls"  => "application/vnd.ms-excel",
            "pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "jpg" or "jpeg" => "image/jpeg",
            "png"  => "image/png",
            "webp" => "image/webp",
            "gif"  => "image/gif",
            "svg"  => "image/svg+xml",
            "bmp"  => "image/bmp",
            "tiff" => "image/tiff",
            "ico"  => "image/x-icon",
            "zip"  => "application/zip",
            "rar"  => "application/x-rar-compressed",
            "7z"   => "application/x-7z-compressed",
            "tar"  => "application/x-tar",
            "gz"   => "application/gzip",
            "mp3"  => "audio/mpeg",
            "wav"  => "audio/wav",
            "ogg"  => "audio/ogg",
            "aac"  => "audio/aac",
            "flac" => "audio/flac",
            "mp4"  => "video/mp4",
            "avi"  => "video/x-msvideo",
            "mov"  => "video/quicktime",
            "mkv"  => "video/x-matroska",
            "webm" => "video/webm",
            "txt"  => "text/plain",
            "html" => "text/html",
            "csv"  => "text/csv",
            "json" => "application/json",
            "xml"  => "application/xml",
            "yaml" or "yml" => "text/yaml",
            "md"   => "text/markdown",
            "css"  => "text/css",
            "js"   => "application/javascript",
            "epub" => "application/epub+zip",
            "mobi" => "application/x-mobipocket-ebook",
            _      => "application/octet-stream"
        };
    }
}
