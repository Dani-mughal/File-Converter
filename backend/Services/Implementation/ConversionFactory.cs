using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ConvertHub.Api.Services.Implementation
{
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
            { ConversionType.JpgToPdf,          "pdf" },
            { ConversionType.PngToPdf,          "pdf" },
            { ConversionType.HeicToPdf,         "pdf" },
            { ConversionType.TiffToPdf,         "pdf" },
            { ConversionType.SvgToPdf,          "pdf" },
            { ConversionType.AiToPdf,           "pdf" },
            { ConversionType.EpsToPdf,          "pdf" },
            { ConversionType.PsdToPdf,          "pdf" },
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
            { ConversionType.SvgToPng,          "svg" },
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
            { ConversionType.SvgToJpg,          "svg" },
            { ConversionType.SvgToPdf,          "svg" },
            { ConversionType.SvgToWebp,         "svg" },
            { ConversionType.SvgToIco,          "svg" },
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
            return type switch
            {
                // 📄 PDF & Documents
                ConversionType.PdfToWord or ConversionType.PdfToDocx or ConversionType.PdfToExcel 
                or ConversionType.PdfToXlsx or ConversionType.PdfToTxt or ConversionType.PdfToHtml 
                or ConversionType.PdfToEpub or ConversionType.PdfToPptx or ConversionType.WordToPdf 
                or ConversionType.DocToPdf or ConversionType.DocxToPdf or ConversionType.DocToTxt 
                or ConversionType.DocToHtml or ConversionType.DocToOdt or ConversionType.DocToRtf 
                or ConversionType.TxtToPdf or ConversionType.TxtToDocx or ConversionType.TxtToHtml 
                or ConversionType.TxtToEpub or ConversionType.PptToPdf or ConversionType.PptxToPdf 
                or ConversionType.PptToJpg or ConversionType.PptToPng or ConversionType.PptToMp4 
                or ConversionType.XlsToCsv or ConversionType.XlsxToCsv or ConversionType.XlsToPdf 
                or ConversionType.XlsxToPdf or ConversionType.XlsToJson or ConversionType.XlsxToJson 
                or ConversionType.ExcelToPdf or ConversionType.MergePdf or ConversionType.SplitPdf 
                or ConversionType.CompressPdf or ConversionType.CompressPdfLow or ConversionType.CompressPdfMed 
                or ConversionType.CompressPdfHigh or ConversionType.EpubToPdf
                    => _serviceProvider.GetRequiredService<PdfConversionService>(),

                // 🖼️ Images & Vector
                ConversionType.PdfToJpg or ConversionType.JpgToPng or ConversionType.PngToJpg 
                or ConversionType.JpgToWebp or ConversionType.WebpToJpg or ConversionType.PngToWebp 
                or ConversionType.JpgToBmp or ConversionType.BmpToJpg or ConversionType.JpgToTiff 
                or ConversionType.TiffToJpg or ConversionType.JpgToGif or ConversionType.GifToJpg 
                or ConversionType.PngToSvg or ConversionType.PngToIco 
                or ConversionType.IcoToPng or ConversionType.PngToPdf or ConversionType.WebpToPng 
                or ConversionType.TiffToPdf or ConversionType.BmpToPng or ConversionType.HeicToJpg 
                or ConversionType.HeicToPng or ConversionType.AvifToPng or ConversionType.RawToJpg 
                or ConversionType.RawToPng or ConversionType.RawToTiff 
                or ConversionType.AiToSvg or ConversionType.AiToPdf 
                or ConversionType.AiToPng or ConversionType.PsdToJpg or ConversionType.PsdToPng 
                or ConversionType.PsdToWebp or ConversionType.PsdToPdf or ConversionType.EpsToSvg 
                or ConversionType.EpsToPdf or ConversionType.EpsToPng or ConversionType.ImageToPdf 
                or ConversionType.JpgToPdf or ConversionType.HeicToPdf or ConversionType.JfifToPng 
                or ConversionType.JfifToJpg or ConversionType.ImageConverter
                    => _serviceProvider.GetRequiredService<ImageConversionService>(),

                // 📐 SVG (Optimized)
                ConversionType.SvgToPng or ConversionType.SvgToJpg or ConversionType.SvgToPdf 
                or ConversionType.SvgToWebp or ConversionType.SvgToIco or ConversionType.SvgToEps
                    => _serviceProvider.GetRequiredService<SvgConversionService>(),

                // 🎬 Media (Video & Audio)
                ConversionType.Mp4ToMp3 or ConversionType.VideoToMp3 or ConversionType.Mp3ToWav 
                or ConversionType.WavToMp3 or ConversionType.Mp3ToAac or ConversionType.AacToMp3 
                or ConversionType.Mp3ToOgg or ConversionType.OggToMp3 or ConversionType.Mp3ToFlac 
                or ConversionType.FlacToMp3 or ConversionType.WavToFlac or ConversionType.WavToAac 
                or ConversionType.M4aToMp3 or ConversionType.FlacToAlac or ConversionType.WmaToMp3 
                or ConversionType.Mp4ToAvi or ConversionType.Mp4ToMov or ConversionType.Mp4ToMkv 
                or ConversionType.Mp4ToWebm or ConversionType.Mp4ToGif or ConversionType.VideoToGif 
                or ConversionType.WebmToGif or ConversionType.AviToMp4 or ConversionType.MovToMp4 
                or ConversionType.MkvToMp4 or ConversionType.WebmToMp4 or ConversionType.FlvToMp4 
                or ConversionType.WmvToMp4 or ConversionType.ThreeGpToMp4 or ConversionType.M4vToMp4 
                or ConversionType.GifToMp4 or ConversionType.ApngToGif or ConversionType.ImageToGif 
                or ConversionType.MovToGif or ConversionType.AviToGif or ConversionType.VideoConverter 
                or ConversionType.AudioConverter or ConversionType.Mp4Converter
                    => _serviceProvider.GetRequiredService<MediaConversionService>(),

                // 📦 Archive
                ConversionType.Zip or ConversionType.Unzip or ConversionType.Archive 
                or ConversionType.ZipToRar or ConversionType.RarToZip or ConversionType.ZipTo7z 
                or ConversionType.SevenZipToZip or ConversionType.ZipToTar or ConversionType.TarToGz 
                or ConversionType.TarGzToZip or ConversionType.CabToZip or ConversionType.IsoToZip
                    => _serviceProvider.GetRequiredService<ArchiveConversionService>(),

                // 💻 Code, Data & Subtitles
                ConversionType.CsvToXlsx or ConversionType.CsvToJson or ConversionType.JsonToCsv 
                or ConversionType.JsonToXml or ConversionType.XmlToJson or ConversionType.JsonToYaml 
                or ConversionType.YamlToJson or ConversionType.JsonToXmlCode or ConversionType.YamlToToml 
                or ConversionType.CsvToSql or ConversionType.SqlToCsv or ConversionType.SqlToJson 
                or ConversionType.MarkdownToHtml or ConversionType.HtmlToMarkdown or ConversionType.HtmlToPdf 
                or ConversionType.HtmlToDocx or ConversionType.UrlToPdf or ConversionType.SrtToVtt 
                or ConversionType.VttToSrt or ConversionType.SrtToAss or ConversionType.AssToSrt 
                or ConversionType.SrtToSub or ConversionType.SubToSrt or ConversionType.VttToTxt 
                or ConversionType.CssMin or ConversionType.JsBeautify
                    => _serviceProvider.GetRequiredService<TextDataConversionService>(),

                _ => throw new NotSupportedException($"No conversion service found for {type}")
            };
        }
    }
}
