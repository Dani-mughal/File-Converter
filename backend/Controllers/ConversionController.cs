using ConvertHub.Api.Data;
using ConvertHub.Api.DTOs;
using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConvertHub.Api.Controllers
{
    [ApiController]
    [Route("api/convert")]
    public class ConvertController : ControllerBase
    {
        private readonly IConversionService _conversionService;
        private readonly IFileStorageService _fileStorageService;
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<ConvertController> _logger;

        public ConvertController(
            IConversionService conversionService, 
            IFileStorageService fileStorageService,
            ApplicationDbContext dbContext,
            ILogger<ConvertController> logger)
        {
            _conversionService = conversionService;
            _fileStorageService = fileStorageService;
            _dbContext = dbContext;
            _logger = logger;
        }

        /// <summary>
        /// Unified endpoint that uploads, converts, immediately downloads the result, and tracks via SQL Server.
        /// </summary>
        [HttpPost]
        [RequestSizeLimit(52428800)] // 50MB
        [RequestFormLimits(MultipartBodyLengthLimit = 52428800)]
        public async Task<IActionResult> ConvertUnified([FromForm] ConvertRequestDto request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest(new ErrorResponseDto { Message = "No file provided." });

            var conversionType = _conversionService.ParseConversionType(request.ConversionType);
            if (conversionType == ConversionType.Unknown)
                return BadRequest(new ErrorResponseDto { Message = "Invalid or unsupported conversion type." });

            string sourcePath = string.Empty;
            string destPath = string.Empty;

            try
            {
                // 1. Save File to storage
                sourcePath = await _fileStorageService.SaveFileAsync(request.File);

                var mimeType = _conversionService.GetOutputMimeType(conversionType);
                var outputFileName = _conversionService.GetOutputFileName(request.File.FileName, conversionType);

                // 2. Track in Database
                var fileRecord = new FileRecord
                {
                    OriginalFileName = request.File.FileName,
                    ConvertedFileName = outputFileName,
                    FileType = request.File.ContentType,
                    ConversionType = request.ConversionType,
                    FilePath = sourcePath,
                    FileSize = request.File.Length
                };

                var conversionJob = new ConversionJob
                {
                    FileRecord = fileRecord,
                    Status = "Processing",
                    StartedAt = DateTime.UtcNow
                };

                _dbContext.Files.Add(fileRecord);
                _dbContext.Conversions.Add(conversionJob);
                await _dbContext.SaveChangesAsync();

                // 3. Process Conversion
                try
                {
                    destPath = await _conversionService.ConvertAsync(sourcePath, conversionType);
                    
                    conversionJob.Status = "Completed";
                    conversionJob.CompletedAt = DateTime.UtcNow;
                }
                catch (Exception ex)
                {
                    conversionJob.Status = "Failed";
                    conversionJob.ErrorMessage = ex.Message;
                    await _dbContext.SaveChangesAsync();
                    throw;
                }

                await _dbContext.SaveChangesAsync();

                // 4. Stream response and clean up
                var memory = new MemoryStream();
                using (var stream = new FileStream(destPath, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;

                return File(memory, mimeType, outputFileName);
            }
            finally
            {
                _fileStorageService.DeleteFiles(new[] { sourcePath, destPath }.Where(p => !string.IsNullOrEmpty(p)));
            }
        }
    }
}
