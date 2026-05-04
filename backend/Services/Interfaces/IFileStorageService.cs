namespace ConvertHub.Api.Services.Interfaces
{
    public interface IFileStorageService
    {
        string GetTempDirectory();
        Task<string> SaveFileAsync(IFormFile file);
        void DeleteFile(string filePath);
    }
}
