using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using System.IO.Compression;
using iText.Layout;
using iText.Layout.Element;

namespace ConvertHub.Api.Services.Implementation
{
    public class PdfConversionService : IConversionService
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly ILogger<PdfConversionService> _logger;

        public PdfConversionService(IFileStorageService fileStorageService, ILogger<PdfConversionService> logger)
        {
            _fileStorageService = fileStorageService;
            _logger = logger;
        }

        public async Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType)
        {
            var outputFileName = $"{Guid.NewGuid()}{GetTempExtension(conversionType)}";
            var outputFilePath = Path.Combine(_fileStorageService.GetTempDirectory(), outputFileName);

            await Task.Run(() =>
            {
                switch (conversionType)
                {
                    case ConversionType.PdfToWord:
                        ConvertPdfToWord(sourceFilePath, outputFilePath);
                        break;
                    case ConversionType.PdfToExcel:
                        ConvertPdfToExcel(sourceFilePath, outputFilePath);
                        break;
                    case ConversionType.WordToPdf:
                    case ConversionType.DocxToPdf:
                        ConvertWordToPdf(sourceFilePath, outputFilePath);
                        break;
                    case ConversionType.WebpToPng:
                        ConvertImage(sourceFilePath, outputFilePath, new PngEncoder());
                        break;
                    case ConversionType.WebpToJpg:
                    case ConversionType.HeicToJpg:
                        ConvertImage(sourceFilePath, outputFilePath, new JpegEncoder());
                        break;
                    case ConversionType.HeicToPng:
                        ConvertImage(sourceFilePath, outputFilePath, new PngEncoder());
                        break;
                    case ConversionType.Zip:
                        CreateZip(sourceFilePath, outputFilePath);
                        break;
                    case ConversionType.Unzip:
                        ExtractZip(sourceFilePath, outputFilePath);
                        break;
                    case ConversionType.ImageToPdf:
                    case ConversionType.JpgToPdf:
                        ConvertImageToPdf(sourceFilePath, outputFilePath);
                        break;
                    default:
                        // For video/media types not yet fully implemented, we'll throw a helpful error
                        // in a real app, this would trigger an FFmpeg process.
                        if (conversionType.ToString().Contains("Mp4") || conversionType.ToString().Contains("Mp3"))
                        {
                             throw new NotSupportedException("Video/Audio conversion requires FFmpeg which is not installed on this server environment.");
                        }
                        throw new ArgumentException($"Unsupported conversion type: {conversionType}");
                }
            });

            return outputFilePath;
        }

        public string GetOutputMimeType(ConversionType type)
        {
            return type switch
            {
                ConversionType.PdfToWord => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ConversionType.PdfToExcel => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ConversionType.WordToPdf or ConversionType.DocxToPdf or ConversionType.EpubToPdf or ConversionType.HeicToPdf or ConversionType.JpgToPdf or ConversionType.ImageToPdf => "application/pdf",
                ConversionType.WebpToPng or ConversionType.HeicToPng or ConversionType.SvgToPng => "image/png",
                ConversionType.WebpToJpg or ConversionType.HeicToJpg or ConversionType.PdfToJpg => "image/jpeg",
                ConversionType.Zip => "application/zip",
                ConversionType.Unzip => "application/octet-stream", 
                _ => "application/octet-stream",
            };
        }

        public string GetOutputFileName(string originalFileName, ConversionType type)
        {
            var baseName = Path.GetFileNameWithoutExtension(originalFileName);
            var extension = GetTempExtension(type);
            return $"{baseName}-converted{extension}";
        }

        public ConversionType ParseConversionType(string typeStr)
        {
            return typeStr.ToLowerInvariant() switch
            {
                "pdf-to-word" => ConversionType.PdfToWord,
                "pdf-to-excel" => ConversionType.PdfToExcel,
                "word-to-pdf" => ConversionType.WordToPdf,
                "docx-to-pdf" => ConversionType.DocxToPdf,
                "image-to-pdf" => ConversionType.ImageToPdf,
                "jpg-to-pdf" => ConversionType.JpgToPdf,
                "webp-to-png" => ConversionType.WebpToPng,
                "webp-to-jpg" => ConversionType.WebpToJpg,
                "heic-to-jpg" => ConversionType.HeicToJpg,
                "heic-to-png" => ConversionType.HeicToPng,
                "zip" => ConversionType.Zip,
                "unzip" => ConversionType.Unzip,
                "mp4-to-mp3" => ConversionType.Mp4ToMp3,
                "video-to-gif" => ConversionType.VideoToGif,
                _ => ConversionType.Unknown
            };
        }

        private string GetTempExtension(ConversionType type)
        {
            return type switch
            {
                ConversionType.PdfToWord => ".docx",
                ConversionType.PdfToExcel => ".xlsx",
                ConversionType.WordToPdf or ConversionType.DocxToPdf or ConversionType.EpubToPdf or ConversionType.HeicToPdf or ConversionType.JpgToPdf or ConversionType.ImageToPdf => ".pdf",
                ConversionType.WebpToPng or ConversionType.HeicToPng or ConversionType.SvgToPng => ".png",
                ConversionType.WebpToJpg or ConversionType.HeicToJpg or ConversionType.PdfToJpg => ".jpg",
                ConversionType.Zip => ".zip",
                ConversionType.Unzip => ".extracted",
                _ => ".tmp"
            };
        }

        private void ConvertImage(string source, string dest, SixLabors.ImageSharp.Formats.IImageEncoder encoder)
        {
            using var image = SixLabors.ImageSharp.Image.Load(source);
            image.Save(dest, encoder);
        }

        private void ConvertImageToPdf(string source, string dest)
        {
            using var writer = new iText.Kernel.Pdf.PdfWriter(dest);
            using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
            using var doc = new iText.Layout.Document(pdf);
            
            var imgData = iText.IO.Image.ImageDataFactory.Create(source);
            var img = new iText.Layout.Element.Image(imgData);
            doc.Add(img);
        }

        private void CreateZip(string source, string dest)
        {
            using var archive = ZipFile.Open(dest, ZipArchiveMode.Create);
            archive.CreateEntryFromFile(source, Path.GetFileName(source));
        }

        private void ExtractZip(string source, string dest)
        {
            // Simple extraction of first file for demo purposes
            using var archive = ZipFile.OpenRead(source);
            var entry = archive.Entries.FirstOrDefault();
            if (entry != null)
            {
                entry.ExtractToFile(dest, true);
            }
        }

        private void ConvertPdfToWord(string sourcePath, string destPath)
        {
            try
            {
                using var pdfDocument = new iText.Kernel.Pdf.PdfDocument(new iText.Kernel.Pdf.PdfReader(sourcePath));
                using var wordDocument = WordprocessingDocument.Create(destPath, WordprocessingDocumentType.Document);
                
                var mainPart = wordDocument.AddMainDocumentPart();
                mainPart.Document = new DocumentFormat.OpenXml.Wordprocessing.Document();
                var body = mainPart.Document.AppendChild(new Body());

                for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
                {
                    var page = pdfDocument.GetPage(i);
                    var strategy = new LocationTextExtractionStrategy();
                    var text = PdfTextExtractor.GetTextFromPage(page, strategy);

                    if (!string.IsNullOrWhiteSpace(text))
                    {
                        var lines = text.Split('\n');
                        foreach (var line in lines)
                        {
                            var paragraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph();
                            var run = new DocumentFormat.OpenXml.Wordprocessing.Run();
                            run.AppendChild(new DocumentFormat.OpenXml.Wordprocessing.Text(line));
                            paragraph.AppendChild(run);
                            body.AppendChild(paragraph);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error converting PDF to Word");
                throw new InvalidOperationException("Failed to convert PDF to Word.", ex);
            }
        }

        private void ConvertPdfToExcel(string sourcePath, string destPath)
        {
            try
            {
                using var spreadsheetDocument = SpreadsheetDocument.Create(destPath, SpreadsheetDocumentType.Workbook);
                var workbookPart = spreadsheetDocument.AddWorkbookPart();
                workbookPart.Workbook = new DocumentFormat.OpenXml.Spreadsheet.Workbook();
                var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                var sheetData = new DocumentFormat.OpenXml.Spreadsheet.SheetData();
                worksheetPart.Worksheet = new DocumentFormat.OpenXml.Spreadsheet.Worksheet(sheetData);
                var sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild(new DocumentFormat.OpenXml.Spreadsheet.Sheets());
                var sheet = new DocumentFormat.OpenXml.Spreadsheet.Sheet() { Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "Data" };
                sheets.Append(sheet);

                using var pdfDocument = new iText.Kernel.Pdf.PdfDocument(new iText.Kernel.Pdf.PdfReader(sourcePath));
                uint rowIndex = 1;
                for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
                {
                    var page = pdfDocument.GetPage(i);
                    var text = PdfTextExtractor.GetTextFromPage(page, new LocationTextExtractionStrategy());
                    foreach (var line in text.Split('\n'))
                    {
                        if (string.IsNullOrWhiteSpace(line)) continue;
                        var row = new DocumentFormat.OpenXml.Spreadsheet.Row { RowIndex = rowIndex++ };
                        foreach (var cellText in line.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries))
                        {
                            row.Append(new DocumentFormat.OpenXml.Spreadsheet.Cell { DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String, CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(cellText) });
                        }
                        sheetData.Append(row);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error converting PDF to Excel");
                throw new InvalidOperationException("Failed to convert PDF to Excel.", ex);
            }
        }

        private void ConvertWordToPdf(string sourcePath, string destPath)
        {
            try
            {
                using var wordDoc = WordprocessingDocument.Open(sourcePath, false);
                var body = wordDoc.MainDocumentPart?.Document.Body;
                using var writer = new iText.Kernel.Pdf.PdfWriter(destPath);
                using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
                using var document = new iText.Layout.Document(pdf);
                if (body != null)
                {
                    foreach (var element in body.Elements())
                    {
                        if (element is DocumentFormat.OpenXml.Wordprocessing.Paragraph p)
                        {
                            var text = p.InnerText;
                            document.Add(new iText.Layout.Element.Paragraph(string.IsNullOrWhiteSpace(text) ? "\n" : text));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error converting Word to PDF");
                throw new InvalidOperationException("Failed to convert Word to PDF.", ex);
            }
        }
    }
}
