using ConvertHub.Api.Services.Interfaces;

namespace ConvertHub.Api.Services.Implementation
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _tempDirectory;
        private readonly ILogger<FileStorageService> _logger;

        public FileStorageService(IWebHostEnvironment env, ILogger<FileStorageService> logger)
        {
            _logger = logger;
            _tempDirectory = Path.Combine(env.ContentRootPath, "TempUploads");
            
            if (!Directory.Exists(_tempDirectory))
            {
                Directory.CreateDirectory(_tempDirectory);
            }
        }

        public async Task<string> SaveFileAsync(IFormFile file)
        {
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(_tempDirectory, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath;
        }

        public void DeleteFile(string filePath)
        {
            try
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete temporary file {FilePath}", filePath);
            }
        }

        public void DeleteFiles(IEnumerable<string> filePaths)
        {
            foreach (var path in filePaths)
            {
                DeleteFile(path);
            }
        }

        public string GetTempDirectory()
        {
            return _tempDirectory;
        }
    }
}
