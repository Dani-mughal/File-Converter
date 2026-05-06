using ConvertHub.Api.Models;

namespace ConvertHub.Api.Services.Interfaces
{
    public interface IConversionFactory
    {
        IConversionService GetService(ConversionType type);
    }
}
