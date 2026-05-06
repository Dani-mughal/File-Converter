using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using FFMpegCore;
using FFMpegCore.Enums;

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
            var ext = GetExtension(conversionType);
            var outputPath = Path.Combine(_storageService.GetTempDirectory(), $"{Guid.NewGuid()}{ext}");
            await ConvertMediaAsync(sourceFilePath, outputPath, conversionType);
            return outputPath;
        }

        public string GetOutputMimeType(ConversionType type) => type switch
        {
            ConversionType.Mp4ToMp3 or ConversionType.VideoToMp3 or ConversionType.WavToMp3
                or ConversionType.FlacToMp3 or ConversionType.AacToMp3 or ConversionType.OggToMp3
                or ConversionType.M4aToMp3 or ConversionType.WmaToMp3 => "audio/mpeg",
            ConversionType.Mp3ToOgg => "audio/ogg",
            ConversionType.Mp3ToWav or ConversionType.WavToFlac => "audio/wav",
            ConversionType.Mp3ToFlac or ConversionType.WavToFlac => "audio/flac",
            ConversionType.Mp3ToAac or ConversionType.WavToAac => "audio/aac",
            ConversionType.VideoToGif or ConversionType.Mp4ToGif or ConversionType.WebmToGif
                or ConversionType.MovToGif or ConversionType.AviToGif => "image/gif",
            ConversionType.GifToMp4 or ConversionType.AviToMp4 or ConversionType.MovToMp4
                or ConversionType.MkvToMp4 or ConversionType.WebmToMp4 or ConversionType.FlvToMp4
                or ConversionType.WmvToMp4 => "video/mp4",
            _ => "video/mp4"
        };

        public string GetOutputFileName(string originalFileName, ConversionType type)
            => $"{Path.GetFileNameWithoutExtension(originalFileName)}{GetExtension(type)}";

        public ConversionType ParseConversionType(string typeStr) => ConversionType.Unknown;

        private string GetExtension(ConversionType type) => type switch
        {
            ConversionType.Mp4ToMp3 or ConversionType.VideoToMp3 or ConversionType.WavToMp3
                or ConversionType.FlacToMp3 or ConversionType.AacToMp3 or ConversionType.OggToMp3
                or ConversionType.M4aToMp3 or ConversionType.WmaToMp3 => ".mp3",
            ConversionType.Mp3ToOgg => ".ogg",
            ConversionType.Mp3ToWav => ".wav",
            ConversionType.Mp3ToFlac or ConversionType.WavToFlac => ".flac",
            ConversionType.Mp3ToAac or ConversionType.WavToAac => ".aac",
            ConversionType.VideoToGif or ConversionType.Mp4ToGif or ConversionType.WebmToGif
                or ConversionType.MovToGif or ConversionType.AviToGif
                or ConversionType.ImageToGif or ConversionType.ApngToGif => ".gif",
            ConversionType.Mp4ToAvi => ".avi",
            ConversionType.Mp4ToMov => ".mov",
            ConversionType.Mp4ToMkv => ".mkv",
            ConversionType.Mp4ToWebm => ".webm",
            _ => ".mp4"
        };

        public async Task ConvertMediaAsync(string sourcePath, string destPath, ConversionType conversionType)
        {
            _logger.LogInformation("[MEDIA SERVICE] {Type}: {Src} → {Dst}", conversionType, sourcePath, destPath);
            try
            {
                switch (conversionType)
                {
                    // ── Audio extractions ──────────────────────────────────────
                    case ConversionType.Mp4ToMp3:
                    case ConversionType.VideoToMp3:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithAudioCodec(AudioCodec.LibMp3Lame)
                                .WithCustomArgument("-vn -q:a 2"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.WavToMp3:
                    case ConversionType.FlacToMp3:
                    case ConversionType.AacToMp3:
                    case ConversionType.OggToMp3:
                    case ConversionType.M4aToMp3:
                    case ConversionType.WmaToMp3:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithAudioCodec(AudioCodec.LibMp3Lame)
                                .WithCustomArgument("-q:a 2"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.Mp3ToWav:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithCustomArgument("-c:a pcm_s16le"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.Mp3ToOgg:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithAudioCodec(AudioCodec.LibVorbis))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.Mp3ToFlac:
                    case ConversionType.WavToFlac:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithCustomArgument("-c:a flac"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.Mp3ToAac:
                    case ConversionType.WavToAac:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithAudioCodec(AudioCodec.Aac))
                            .ProcessAsynchronously();
                        break;

                    // ── Video → GIF ────────────────────────────────────────────
                    case ConversionType.VideoToGif:
                    case ConversionType.Mp4ToGif:
                    case ConversionType.WebmToGif:
                    case ConversionType.MovToGif:
                    case ConversionType.AviToGif:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithCustomArgument("-vf \"fps=10,scale=480:-1:flags=lanczos\"")
                                .WithCustomArgument("-loop 0"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.ImageToGif:
                    case ConversionType.ApngToGif:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithCustomArgument("-loop 0"))
                            .ProcessAsynchronously();
                        break;

                    // ── GIF → MP4 ──────────────────────────────────────────────
                    case ConversionType.GifToMp4:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithVideoCodec(VideoCodec.LibX264)
                                .WithCustomArgument("-vf \"scale=trunc(iw/2)*2:trunc(ih/2)*2\"")
                                .WithCustomArgument("-preset ultrafast -pix_fmt yuv420p"))
                            .ProcessAsynchronously();
                        break;

                    // ── Video format conversions ───────────────────────────────
                    case ConversionType.MovToMp4:
                    case ConversionType.AviToMp4:
                    case ConversionType.MkvToMp4:
                    case ConversionType.WebmToMp4:
                    case ConversionType.FlvToMp4:
                    case ConversionType.WmvToMp4:
                    case ConversionType.ThreeGpToMp4:
                    case ConversionType.M4vToMp4:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithVideoCodec(VideoCodec.LibX264)
                                .WithAudioCodec(AudioCodec.Aac)
                                .WithCustomArgument("-preset ultrafast -movflags +faststart"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.Mp4ToAvi:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithVideoCodec(VideoCodec.LibX264)
                                .WithAudioCodec(AudioCodec.LibMp3Lame))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.Mp4ToWebm:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithVideoCodec(VideoCodec.LibVpx)
                                .WithAudioCodec(AudioCodec.LibVorbis)
                                .WithCustomArgument("-preset ultrafast -deadline realtime"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.Mp4ToMkv:
                    case ConversionType.Mp4ToMov:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .CopyChannel()
                                .WithCustomArgument("-movflags +faststart"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.VideoConverter:
                    case ConversionType.Mp4Converter:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithVideoCodec(VideoCodec.LibX264)
                                .WithAudioCodec(AudioCodec.Aac)
                                .WithCustomArgument("-preset ultrafast -movflags +faststart"))
                            .ProcessAsynchronously();
                        break;

                    case ConversionType.AudioConverter:
                        await FFMpegArguments.FromFileInput(sourcePath)
                            .OutputToFile(destPath, true, o => o
                                .WithAudioCodec(AudioCodec.LibMp3Lame)
                                .WithCustomArgument("-q:a 2"))
                            .ProcessAsynchronously();
                        break;

                    default:
                        throw new NotSupportedException($"Media conversion '{conversionType}' is not supported.");
                }
                _logger.LogInformation("[MEDIA SERVICE DONE] {Type}", conversionType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[MEDIA SERVICE FAILED] {Type}", conversionType);
                throw new InvalidOperationException($"Media conversion failed: {ex.Message}", ex);
            }
        }
    }
}
