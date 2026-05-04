using ConvertHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ConvertHub.Api.Services.Implementation
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public string GetTempDirectory()
        {
            var path = Path.Combine(_env.ContentRootPath, "TempUploads");
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            return path;
        }

        public async Task<string> SaveFileAsync(IFormFile file)
        {
            var tempDir = GetTempDirectory();
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(tempDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath;
        }

        public void DeleteFile(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}
