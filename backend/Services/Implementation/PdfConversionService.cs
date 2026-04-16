using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

using Document = iText.Layout.Document;
using Image = iText.Layout.Element.Image;
using Text = iText.Layout.Element.Text;
using Paragraph = iText.Layout.Element.Paragraph;
using iText.IO.Image;

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
                    case ConversionType.ImageToPdf:
                        ConvertImageToPdf(sourceFilePath, outputFilePath);
                        break;
                    default:
                        throw new ArgumentException("Unsupported conversion type");
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
                ConversionType.ImageToPdf => "application/pdf",
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
                "image-to-pdf" => ConversionType.ImageToPdf,
                _ => ConversionType.Unknown
            };
        }

        private string GetTempExtension(ConversionType type)
        {
            return type switch
            {
                ConversionType.PdfToWord => ".docx",
                ConversionType.PdfToExcel => ".xlsx",
                ConversionType.ImageToPdf => ".pdf",
                _ => ".tmp"
            };
        }

        private void ConvertPdfToWord(string sourcePath, string destPath)
        {
            try
            {
                using var pdfDocument = new PdfDocument(new PdfReader(sourcePath));
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
                throw new InvalidOperationException("Failed to convert PDF to Word. Ensure the file is not corrupted or password protected.", ex);
            }
        }

        private void ConvertPdfToExcel(string sourcePath, string destPath)
        {
            // Placeholder: robust PDF to Excel table extraction is highly complex and usually requires commercial libraries.
            // Using a simple OpenXML creation to satisfy basic requirements. Real-world apps use tools like Tabula or Aspose.
            try
            {
                using var spreadsheetDocument = SpreadsheetDocument.Create(destPath, SpreadsheetDocumentType.Workbook);
                var workbookPart = spreadsheetDocument.AddWorkbookPart();
                workbookPart.Workbook = new DocumentFormat.OpenXml.Spreadsheet.Workbook();

                var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                var sheetData = new DocumentFormat.OpenXml.Spreadsheet.SheetData();
                worksheetPart.Worksheet = new DocumentFormat.OpenXml.Spreadsheet.Worksheet(sheetData);

                var sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild(new DocumentFormat.OpenXml.Spreadsheet.Sheets());
                var sheet = new DocumentFormat.OpenXml.Spreadsheet.Sheet() { Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "ExtractedData" };
                sheets.Append(sheet);

                using var pdfDocument = new PdfDocument(new PdfReader(sourcePath));
                uint rowIndex = 1;
                for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
                {
                    var page = pdfDocument.GetPage(i);
                    var text = PdfTextExtractor.GetTextFromPage(page, new LocationTextExtractionStrategy());
                    
                    var lines = text.Split('\n');
                    foreach (var line in lines)
                    {
                        if (string.IsNullOrWhiteSpace(line)) continue;

                        var row = new DocumentFormat.OpenXml.Spreadsheet.Row { RowIndex = rowIndex++ };
                        
                        // rudimentary column splitting by spaces or tabs
                        var cells = line.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
                        
                        foreach (var cellText in cells)
                        {
                            var cell = new DocumentFormat.OpenXml.Spreadsheet.Cell
                            {
                                DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String,
                                CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(cellText)
                            };
                            row.AppendChild(cell);
                        }
                        sheetData.AppendChild(row);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error converting PDF to Excel");
                throw new InvalidOperationException("Failed to convert PDF to Excel.", ex);
            }
        }

        private void ConvertImageToPdf(string sourcePath, string destPath)
        {
            try
            {
                // Verify image with ImageSharp first
                using (var image = SixLabors.ImageSharp.Image.Load(sourcePath))
                {
                    using var writer = new PdfWriter(destPath);
                    using var pdf = new PdfDocument(writer);
                    using var document = new Document(pdf);

                    var imageData = ImageDataFactory.Create(sourcePath);
                    var pdfImage = new Image(imageData);
                    document.Add(pdfImage);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error converting Image to PDF");
                throw new InvalidOperationException("Failed to convert Image to PDF. Ensure the image is valid.", ex);
            }
        }
    }
}
