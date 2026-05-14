namespace ConvertHub.Api.Services.Interfaces
{
    public interface IFileStorageService
    {
        string GetTempDirectory();
        Task<string> SaveFileAsync(IFormFile file);
        Task<string[]> SaveFilesAsync(IEnumerable<IFormFile> files);
        void DeleteFile(string filePath);
    }
}
