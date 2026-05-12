using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ConvertHub.Api.Services.Implementation
{
    public class ConversionFactory : IConversionFactory
    {
        private readonly IServiceProvider _serviceProvider;

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
                or ConversionType.CompressPdf or ConversionType.EpubToPdf
                    => _serviceProvider.GetRequiredService<PdfConversionService>(),

                // 🖼️ Images & Vector
                ConversionType.PdfToJpg or ConversionType.JpgToPng or ConversionType.PngToJpg 
                or ConversionType.JpgToWebp or ConversionType.WebpToJpg or ConversionType.PngToWebp 
                or ConversionType.JpgToBmp or ConversionType.BmpToJpg or ConversionType.JpgToTiff 
                or ConversionType.TiffToJpg or ConversionType.JpgToGif or ConversionType.GifToJpg 
                or ConversionType.PngToSvg or ConversionType.SvgToPng or ConversionType.PngToIco 
                or ConversionType.IcoToPng or ConversionType.PngToPdf or ConversionType.WebpToPng 
                or ConversionType.TiffToPdf or ConversionType.BmpToPng or ConversionType.HeicToJpg 
                or ConversionType.HeicToPng or ConversionType.AvifToPng or ConversionType.RawToJpg 
                or ConversionType.RawToPng or ConversionType.RawToTiff or ConversionType.SvgToJpg 
                or ConversionType.SvgToPdf or ConversionType.SvgToWebp or ConversionType.SvgToIco 
                or ConversionType.SvgToEps or ConversionType.AiToSvg or ConversionType.AiToPdf 
                or ConversionType.AiToPng or ConversionType.PsdToJpg or ConversionType.PsdToPng 
                or ConversionType.PsdToWebp or ConversionType.PsdToPdf or ConversionType.EpsToSvg 
                or ConversionType.EpsToPdf or ConversionType.EpsToPng or ConversionType.ImageToPdf 
                or ConversionType.JpgToPdf or ConversionType.HeicToPdf or ConversionType.JfifToPng 
                or ConversionType.JfifToJpg or ConversionType.ImageConverter
                    => _serviceProvider.GetRequiredService<ImageConversionService>(),

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
