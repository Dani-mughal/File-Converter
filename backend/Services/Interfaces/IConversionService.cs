using ConvertHub.Api.Models;
using System.Threading.Tasks;

namespace ConvertHub.Api.Services.Interfaces
{
    public interface IConversionService
    {
        Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType);
        string GetOutputMimeType(ConversionType type);
        string GetOutputFileName(string originalFileName, ConversionType type);
        ConversionType ParseConversionType(string typeStr);
    }
}
