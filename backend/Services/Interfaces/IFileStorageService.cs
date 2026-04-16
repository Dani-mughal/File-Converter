using ConvertHub.Api.Models;

namespace ConvertHub.Api.Services.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file);
        void DeleteFile(string filePath);
        void DeleteFiles(IEnumerable<string> filePaths);
        string GetTempDirectory();
    }
}
