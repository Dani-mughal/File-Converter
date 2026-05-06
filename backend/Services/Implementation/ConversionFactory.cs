using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;

namespace ConvertHub.Api.Services.Implementation
{
    /// <summary>
    /// Routes each ConversionType to the correct service via an explicit dictionary.
    /// No fragile string-contains matching.
    /// </summary>
    public class ConversionFactory : IConversionFactory
    {
        private readonly IServiceProvider _serviceProvider;

        // Explicitly map every supported ConversionType to its service.
        // "pdf" = PdfConversionService, "image" = ImageConversionService,
        // "media" = MediaConversionService, "text" = TextDataConversionService
        private static readonly Dictionary<ConversionType, string> _routeMap = new()
        {
            // ── Documents / PDF ──────────────────────────────────────────────
            { ConversionType.PdfToWord,         "pdf" },
            { ConversionType.PdfToExcel,        "pdf" },
            { ConversionType.PdfToDocx,         "pdf" },
            { ConversionType.PdfToTxt,          "pdf" },
            { ConversionType.PdfToHtml,         "pdf" },
            { ConversionType.PdfToEpub,         "pdf" },
            { ConversionType.PdfToPptx,         "pdf" },
            { ConversionType.PdfToXlsx,         "pdf" },
            { ConversionType.WordToPdf,         "pdf" },
            { ConversionType.DocxToPdf,         "pdf" },
            { ConversionType.DocToPdf,          "pdf" },
            { ConversionType.DocToTxt,          "pdf" },
            { ConversionType.DocToHtml,         "pdf" },
            { ConversionType.DocToOdt,          "pdf" },
            { ConversionType.DocToRtf,          "pdf" },
            { ConversionType.TxtToPdf,          "pdf" },
            { ConversionType.TxtToDocx,         "pdf" },
            { ConversionType.TxtToHtml,         "pdf" },
            { ConversionType.TxtToEpub,         "pdf" },
            { ConversionType.PptToPdf,          "pdf" },
            { ConversionType.PptxToPdf,         "pdf" },
            { ConversionType.PptToJpg,          "pdf" },
            { ConversionType.PptToPng,          "pdf" },
            { ConversionType.PptToMp4,          "pdf" },
            { ConversionType.XlsToCsv,          "pdf" },
            { ConversionType.XlsxToCsv,         "pdf" },
            { ConversionType.XlsToPdf,          "pdf" },
            { ConversionType.XlsxToPdf,         "pdf" },
            { ConversionType.XlsToJson,         "pdf" },
            { ConversionType.XlsxToJson,        "pdf" },
            { ConversionType.CsvToXlsx,         "pdf" },
            { ConversionType.ExcelToPdf,        "pdf" },
            { ConversionType.EpubToPdf,         "pdf" },
            { ConversionType.HeicToPdf,         "pdf" },
            { ConversionType.JpgToPdf,          "pdf" },
            { ConversionType.ImageToPdf,        "pdf" },
            { ConversionType.DocumentToPdf,     "pdf" },
            { ConversionType.HtmlToPdf,         "pdf" },
            { ConversionType.HtmlToDocx,        "pdf" },
            { ConversionType.UrlToPdf,          "pdf" },
            { ConversionType.Zip,               "pdf" },
            { ConversionType.Unzip,             "pdf" },
            { ConversionType.Archive,           "pdf" },

            // ── Images ───────────────────────────────────────────────────────
            { ConversionType.JpgToPng,          "image" },
            { ConversionType.PngToJpg,          "image" },
            { ConversionType.JpgToWebp,         "image" },
            { ConversionType.WebpToJpg,         "image" },
            { ConversionType.PngToWebp,         "image" },
            { ConversionType.WebpToPng,         "image" },
            { ConversionType.JpgToBmp,          "image" },
            { ConversionType.BmpToJpg,          "image" },
            { ConversionType.JpgToTiff,         "image" },
            { ConversionType.TiffToJpg,         "image" },
            { ConversionType.JpgToGif,          "image" },
            { ConversionType.GifToJpg,          "image" },
            { ConversionType.PngToSvg,          "image" },
            { ConversionType.SvgToPng,          "image" },
            { ConversionType.PngToIco,          "image" },
            { ConversionType.IcoToPng,          "image" },
            { ConversionType.PngToPdf,          "image" },
            { ConversionType.TiffToPdf,         "image" },
            { ConversionType.BmpToPng,          "image" },
            { ConversionType.HeicToJpg,         "image" },
            { ConversionType.HeicToPng,         "image" },
            { ConversionType.AvifToPng,         "image" },
            { ConversionType.RawToJpg,          "image" },
            { ConversionType.RawToPng,          "image" },
            { ConversionType.RawToTiff,         "image" },
            { ConversionType.PdfToJpg,          "image" },
            { ConversionType.JfifToPng,         "image" },
            { ConversionType.ImageConverter,    "image" },
            // Vector/Design
            { ConversionType.SvgToJpg,          "image" },
            { ConversionType.SvgToPdf,          "image" },
            { ConversionType.SvgToWebp,         "image" },
            { ConversionType.SvgToIco,          "image" },
            { ConversionType.SvgToEps,          "image" },
            { ConversionType.AiToSvg,           "image" },
            { ConversionType.AiToPdf,           "image" },
            { ConversionType.AiToPng,           "image" },
            { ConversionType.PsdToJpg,          "image" },
            { ConversionType.PsdToPng,          "image" },
            { ConversionType.PsdToWebp,         "image" },
            { ConversionType.PsdToPdf,          "image" },
            { ConversionType.EpsToSvg,          "image" },
            { ConversionType.EpsToPdf,          "image" },
            { ConversionType.EpsToPng,          "image" },

            // ── Audio ────────────────────────────────────────────────────────
            { ConversionType.Mp3ToWav,          "media" },
            { ConversionType.WavToMp3,          "media" },
            { ConversionType.Mp3ToAac,          "media" },
            { ConversionType.AacToMp3,          "media" },
            { ConversionType.Mp3ToOgg,          "media" },
            { ConversionType.OggToMp3,          "media" },
            { ConversionType.Mp3ToFlac,         "media" },
            { ConversionType.FlacToMp3,         "media" },
            { ConversionType.WavToFlac,         "media" },
            { ConversionType.WavToAac,          "media" },
            { ConversionType.M4aToMp3,          "media" },
            { ConversionType.FlacToAlac,        "media" },
            { ConversionType.WmaToMp3,          "media" },
            { ConversionType.Mp4ToMp3,          "media" },
            { ConversionType.VideoToMp3,        "media" },
            { ConversionType.AudioConverter,    "media" },

            // ── Video ────────────────────────────────────────────────────────
            { ConversionType.Mp4ToAvi,          "media" },
            { ConversionType.Mp4ToMov,          "media" },
            { ConversionType.Mp4ToMkv,          "media" },
            { ConversionType.Mp4ToWebm,         "media" },
            { ConversionType.Mp4ToGif,          "media" },
            { ConversionType.WebmToGif,         "media" },
            { ConversionType.AviToMp4,          "media" },
            { ConversionType.MovToMp4,          "media" },
            { ConversionType.MkvToMp4,          "media" },
            { ConversionType.WebmToMp4,         "media" },
            { ConversionType.FlvToMp4,          "media" },
            { ConversionType.WmvToMp4,          "media" },
            { ConversionType.ThreeGpToMp4,      "media" },
            { ConversionType.M4vToMp4,          "media" },
            { ConversionType.VideoToGif,        "media" },
            { ConversionType.MovToGif,          "media" },
            { ConversionType.AviToGif,          "media" },
            { ConversionType.GifToMp4,          "media" },
            { ConversionType.ImageToGif,        "media" },
            { ConversionType.ApngToGif,         "media" },
            { ConversionType.VideoConverter,    "media" },
            { ConversionType.Mp4Converter,      "media" },

            // ── Text / Data / Code ───────────────────────────────────────────
            { ConversionType.JsonToCsv,         "text" },
            { ConversionType.CsvToJson,         "text" },
            { ConversionType.XmlToJson,         "text" },
            { ConversionType.JsonToXml,         "text" },
            { ConversionType.MarkdownToHtml,    "text" },
            { ConversionType.HtmlToMarkdown,    "text" },
            { ConversionType.CssMin,            "text" },
            { ConversionType.JsBeautify,        "text" },
            { ConversionType.JsonToYaml,        "text" },
            { ConversionType.YamlToJson,        "text" },
            { ConversionType.JsonToXmlCode,     "text" },
            { ConversionType.YamlToToml,        "text" },
            { ConversionType.CsvToSql,          "text" },
            { ConversionType.SqlToCsv,          "text" },
            { ConversionType.SqlToJson,         "text" },
        };

        public ConversionFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public IConversionService GetService(ConversionType type)
        {
            if (_routeMap.TryGetValue(type, out var svc))
            {
                return svc switch
                {
                    "pdf"   => _serviceProvider.GetRequiredService<PdfConversionService>(),
                    "image" => _serviceProvider.GetRequiredService<ImageConversionService>(),
                    "media" => _serviceProvider.GetRequiredService<MediaConversionService>(),
                    "text"  => _serviceProvider.GetRequiredService<TextDataConversionService>(),
                    _       => _serviceProvider.GetRequiredService<PdfConversionService>()
                };
            }

            // Unknown type — return PdfConversionService which will throw a clear error
            return _serviceProvider.GetRequiredService<PdfConversionService>();
        }
    }
}
