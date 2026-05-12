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
                // PDF & Document Operations
                ConversionType.PdfToWord or ConversionType.PdfToDocx or ConversionType.PdfToExcel 
                or ConversionType.PdfToXlsx or ConversionType.PdfToTxt or ConversionType.PdfToHtml 
                or ConversionType.WordToPdf or ConversionType.DocxToPdf or ConversionType.DocToPdf 
                or ConversionType.TxtToPdf or ConversionType.TxtToDocx or ConversionType.TxtToHtml 
                or ConversionType.EpubToPdf or ConversionType.PptToPdf or ConversionType.PptxToPdf 
                or ConversionType.XlsToPdf or ConversionType.XlsxToPdf or ConversionType.ExcelToPdf 
                or ConversionType.HtmlToPdf
                    => _serviceProvider.GetRequiredService<PdfConversionService>(),

                // Image Operations
                ConversionType.PdfToJpg or ConversionType.WebpToPng or ConversionType.JfifToPng 
                or ConversionType.HeicToPng or ConversionType.SvgToPng or ConversionType.WebpToJpg 
                or ConversionType.HeicToJpg or ConversionType.PngToSvg or ConversionType.ImageConverter 
                or ConversionType.SvgToJpg or ConversionType.SvgToPdf or ConversionType.PsdToJpg 
                or ConversionType.PsdToPng or ConversionType.PsdToWebp or ConversionType.EpsToSvg 
                or ConversionType.EpsToPdf or ConversionType.EpsToPng or ConversionType.AiToSvg 
                or ConversionType.AiToPdf or ConversionType.AiToPng or ConversionType.PngToPdf 
                or ConversionType.JpgToPdf or ConversionType.HeicToPdf or ConversionType.TiffToPdf 
                or ConversionType.ImageToPdf or ConversionType.PptToPng or ConversionType.PptToJpg
                    => _serviceProvider.GetRequiredService<ImageConversionService>(),

                // Media (Audio/Video) Operations
                ConversionType.Mp4ToMp3 or ConversionType.VideoToMp3 or ConversionType.Mp3ToOgg 
                or ConversionType.VideoToGif or ConversionType.Mp4ToGif or ConversionType.WebmToGif 
                or ConversionType.ApngToGif or ConversionType.GifToMp4 or ConversionType.MovToMp4 
                or ConversionType.ImageToGif or ConversionType.MovToGif or ConversionType.AviToGif 
                or ConversionType.AviToMp4 or ConversionType.MkvToMp4 or ConversionType.WavToMp3 
                or ConversionType.FlacToMp3 or ConversionType.Mp3ToWav or ConversionType.M4aToMp3 
                or ConversionType.WmaToMp3 or ConversionType.VideoConverter or ConversionType.Mp4ToAvi 
                or ConversionType.Mp4ToMov or ConversionType.Mp4ToMkv or ConversionType.Mp4ToWebm 
                or ConversionType.AudioConverter
                    => _serviceProvider.GetRequiredService<MediaConversionService>(),

                // Archive Operations
                ConversionType.Zip or ConversionType.Archive or ConversionType.Unzip
                    => _serviceProvider.GetRequiredService<ArchiveConversionService>(),

                // Text/Data/Code Operations
                ConversionType.JsonToCsv or ConversionType.CsvToJson or ConversionType.XmlToJson 
                or ConversionType.JsonToXml or ConversionType.MarkdownToHtml or ConversionType.HtmlToMarkdown 
                or ConversionType.CssMin or ConversionType.JsBeautify or ConversionType.JsonToYaml 
                or ConversionType.YamlToJson or ConversionType.XlsToCsv or ConversionType.XlsxToCsv
                    => _serviceProvider.GetRequiredService<TextDataConversionService>(),

                _ => throw new NotSupportedException($"No conversion service found for {type}")
            };
        }
    }
}
