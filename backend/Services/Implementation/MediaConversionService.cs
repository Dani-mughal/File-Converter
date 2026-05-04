using ConvertHub.Api.Models;
using FFMpegCore;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;
using System;

using ConvertHub.Api.Services.Interfaces;

namespace ConvertHub.Api.Services.Implementation
{
    public class MediaConversionService : IConversionService
    {
        private readonly ILogger<MediaConversionService> _logger;
        private readonly IFileStorageService _storageService;

        public MediaConversionService(ILogger<MediaConversionService> logger, IFileStorageService storageService)
        {
            _logger = logger;
            _storageService = storageService;
        }

        public async Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType)
        {
            var ext = GetTempExtension(conversionType);
            var outputPath = Path.Combine(_storageService.GetTempDirectory(), $"{Guid.NewGuid()}{ext}");
            await ConvertMediaAsync(sourceFilePath, outputPath, conversionType);
            return outputPath;
        }

        public string GetOutputMimeType(ConversionType type)
        {
            return type switch
            {
                ConversionType.Mp4ToMp3 or ConversionType.VideoToMp3 => "audio/mpeg",
                ConversionType.Mp3ToOgg => "audio/ogg",
                ConversionType.VideoToGif or ConversionType.Mp4ToGif or ConversionType.WebmToGif or ConversionType.MovToGif or ConversionType.AviToGif or ConversionType.ImageToGif or ConversionType.ApngToGif => "image/gif",
                _ => "video/mp4"
            };
        }

        public string GetOutputFileName(string originalFileName, ConversionType type)
        {
            return $"{Path.GetFileNameWithoutExtension(originalFileName)}{GetTempExtension(type)}";
        }

        public ConversionType ParseConversionType(string typeStr) => ConversionType.Unknown;

        private string GetTempExtension(ConversionType type)
        {
            return type switch
            {
                ConversionType.Mp4ToMp3 or ConversionType.VideoToMp3 => ".mp3",
                ConversionType.Mp3ToOgg => ".ogg",
                ConversionType.VideoToGif or ConversionType.Mp4ToGif or ConversionType.WebmToGif or ConversionType.MovToGif or ConversionType.AviToGif or ConversionType.ImageToGif or ConversionType.ApngToGif => ".gif",
                _ => ".mp4"
            };
        }

        public async Task ConvertMediaAsync(string sourcePath, string destPath, ConversionType conversionType)
        {
            try
            {
                switch (conversionType)
                {
                    case ConversionType.Mp4ToMp3:
                    case ConversionType.VideoToMp3:
                        await FFMpegArguments
                            .FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, options => options
                                .WithAudioCodec(FFMpegCore.Enums.AudioCodec.LibMp3Lame)
                                .WithCustomArgument("-vn"))
                            .ProcessAsynchronously();
                        break;
                    case ConversionType.Mp3ToOgg:
                        await FFMpegArguments
                            .FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, options => options
                                .WithAudioCodec(FFMpegCore.Enums.AudioCodec.LibVorbis))
                            .ProcessAsynchronously();
                        break;
                    case ConversionType.VideoToGif:
                    case ConversionType.Mp4ToGif:
                    case ConversionType.WebmToGif:
                    case ConversionType.MovToGif:
                    case ConversionType.AviToGif:
                        await FFMpegArguments
                            .FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, options => options
                                .WithCustomArgument("-c:v gif")
                                .WithFramerate(10))
                            .ProcessAsynchronously();
                        break;
                    case ConversionType.ImageToGif:
                    case ConversionType.ApngToGif:
                        await FFMpegArguments
                            .FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, options => options
                                .WithCustomArgument("-c:v gif"))
                            .ProcessAsynchronously();
                        break;
                    case ConversionType.GifToMp4:
                        await FFMpegArguments
                            .FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, options => options
                                .WithVideoCodec(FFMpegCore.Enums.VideoCodec.LibX264))
                            .ProcessAsynchronously();
                        break;
                    case ConversionType.MovToMp4:
                        await FFMpegArguments
                            .FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, options => options
                                .WithVideoCodec(FFMpegCore.Enums.VideoCodec.LibX264)
                                .WithAudioCodec(FFMpegCore.Enums.AudioCodec.Aac))
                            .ProcessAsynchronously();
                        break;
                    default:
                        throw new NotSupportedException($"Media conversion type {conversionType} is not fully supported yet.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error converting media for {conversionType}");
                throw new InvalidOperationException($"Failed to convert media.", ex);
            }
        }
    }
}
