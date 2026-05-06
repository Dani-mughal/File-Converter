using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using System.IO.Compression;
using iText.Layout;
using iText.Layout.Element;

// Aliases to avoid ambiguity
using Wp = DocumentFormat.OpenXml.Wordprocessing;
using iTextLayout = iText.Layout;
using iTextElt = iText.Layout.Element;

namespace ConvertHub.Api.Services.Implementation
{
    public class PdfConversionService : IConversionService
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly ILogger<PdfConversionService> _logger;
        private readonly MediaConversionService _mediaService;
        private readonly ImageConversionService _imageService;
        private readonly TextDataConversionService _textDataService;

        public PdfConversionService(
            IFileStorageService fileStorageService,
            ILogger<PdfConversionService> logger,
            MediaConversionService mediaService,
            ImageConversionService imageService,
            TextDataConversionService textDataService)
        {
            _fileStorageService = fileStorageService;
            _logger = logger;
            _mediaService = mediaService;
            _imageService = imageService;
            _textDataService = textDataService;
        }

        public async Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType)
        {
            var outputFileName = $"{Guid.NewGuid()}{GetExtension(conversionType)}";
            var outputFilePath = Path.Combine(_fileStorageService.GetTempDirectory(), outputFileName);

            _logger.LogInformation("[PDF SERVICE] Converting {Type}: {Src} → {Dst}", conversionType, sourceFilePath, outputFilePath);

            switch (conversionType)
            {
                // PDF → Document
                case ConversionType.PdfToWord:
                case ConversionType.PdfToDocx:
                    await Task.Run(() => ConvertPdfToWord(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.PdfToExcel:
                case ConversionType.PdfToXlsx:
                    await Task.Run(() => ConvertPdfToExcel(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.PdfToTxt:
                    await Task.Run(() => ConvertPdfToTxt(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.PdfToHtml:
                    await Task.Run(() => ConvertPdfToHtml(sourceFilePath, outputFilePath));
                    break;

                // Word/Doc → PDF
                case ConversionType.WordToPdf:
                case ConversionType.DocxToPdf:
                case ConversionType.DocToPdf:
                    await Task.Run(() => ConvertWordToPdf(sourceFilePath, outputFilePath));
                    break;

                // Doc → Text
                case ConversionType.DocToTxt:
                    await Task.Run(() => ConvertDocToTxt(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.DocToHtml:
                    await Task.Run(() => ConvertDocToHtml(sourceFilePath, outputFilePath));
                    break;

                // TXT conversions
                case ConversionType.TxtToPdf:
                    await Task.Run(() => ConvertTxtToPdf(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.TxtToDocx:
                    await Task.Run(() => ConvertTxtToDocx(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.TxtToHtml:
                    await Task.Run(() => ConvertTxtToHtml(sourceFilePath, outputFilePath));
                    break;

                // PPT → PDF (via LibreOffice if available, else placeholder)
                case ConversionType.PptToPdf:
                case ConversionType.PptxToPdf:
                    await Task.Run(() => ConvertOfficeToPdf(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.PptToJpg:
                case ConversionType.PptToPng:
                    await Task.Run(() => ConvertOfficeToPdf(sourceFilePath, outputFilePath));
                    break;

                // Excel → CSV/JSON/PDF
                case ConversionType.XlsToCsv:
                case ConversionType.XlsxToCsv:
                    await Task.Run(() => ConvertOfficeToCsv(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.XlsToPdf:
                case ConversionType.XlsxToPdf:
                case ConversionType.ExcelToPdf:
                    await Task.Run(() => ConvertOfficeToPdf(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.XlsToJson:
                case ConversionType.XlsxToJson:
                    await Task.Run(() => ConvertOfficeToJson(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.CsvToXlsx:
                    await Task.Run(() => ConvertCsvToXlsx(sourceFilePath, outputFilePath));
                    break;

                // Image → PDF
                case ConversionType.ImageToPdf:
                case ConversionType.JpgToPdf:
                case ConversionType.PngToPdf:
                case ConversionType.HeicToPdf:
                case ConversionType.TiffToPdf:
                    await Task.Run(() => ConvertImageToPdf(sourceFilePath, outputFilePath));
                    break;

                // HTML → PDF/Docx
                case ConversionType.HtmlToPdf:
                    await Task.Run(() => ConvertHtmlToPdf(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.HtmlToDocx:
                    await Task.Run(() => ConvertHtmlToDocx(sourceFilePath, outputFilePath));
                    break;

                // Archives
                case ConversionType.Zip:
                case ConversionType.Archive:
                    await Task.Run(() => CreateZip(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.Unzip:
                    await Task.Run(() => ExtractZip(sourceFilePath, outputFilePath));
                    break;

                // Ebook → PDF
                case ConversionType.EpubToPdf:
                    await Task.Run(() => ConvertEpubToPdf(sourceFilePath, outputFilePath));
                    break;

                // Delegate to sub-services
                case ConversionType.PdfToJpg:
                case ConversionType.WebpToPng:
                case ConversionType.JfifToPng:
                case ConversionType.HeicToPng:
                case ConversionType.SvgToPng:
                case ConversionType.WebpToJpg:
                case ConversionType.HeicToJpg:
                case ConversionType.PngToSvg:
                case ConversionType.ImageConverter:
                case ConversionType.SvgToJpg:
                case ConversionType.SvgToPdf:
                case ConversionType.PsdToJpg:
                case ConversionType.PsdToPng:
                case ConversionType.PsdToWebp:
                case ConversionType.EpsToSvg:
                case ConversionType.EpsToPdf:
                case ConversionType.EpsToPng:
                case ConversionType.AiToSvg:
                case ConversionType.AiToPdf:
                case ConversionType.AiToPng:
                    await _imageService.ConvertImageAsync(sourceFilePath, outputFilePath, conversionType);
                    break;

                case ConversionType.Mp4ToMp3:
                case ConversionType.VideoToMp3:
                case ConversionType.Mp3ToOgg:
                case ConversionType.VideoToGif:
                case ConversionType.Mp4ToGif:
                case ConversionType.WebmToGif:
                case ConversionType.ApngToGif:
                case ConversionType.GifToMp4:
                case ConversionType.MovToMp4:
                case ConversionType.ImageToGif:
                case ConversionType.MovToGif:
                case ConversionType.AviToGif:
                case ConversionType.AviToMp4:
                case ConversionType.MkvToMp4:
                case ConversionType.WavToMp3:
                case ConversionType.FlacToMp3:
                case ConversionType.Mp3ToWav:
                case ConversionType.M4aToMp3:
                case ConversionType.WmaToMp3:
                    await _mediaService.ConvertMediaAsync(sourceFilePath, outputFilePath, conversionType);
                    break;

                case ConversionType.JsonToCsv:
                case ConversionType.CsvToJson:
                case ConversionType.XmlToJson:
                case ConversionType.JsonToXml:
                case ConversionType.MarkdownToHtml:
                case ConversionType.HtmlToMarkdown:
                case ConversionType.CssMin:
                case ConversionType.JsBeautify:
                case ConversionType.JsonToYaml:
                case ConversionType.YamlToJson:
                    await _textDataService.ConvertTextDataAsync(sourceFilePath, outputFilePath, conversionType);
                    break;

                default:
                    throw new NotSupportedException($"Conversion '{conversionType}' is not yet implemented.");
            }

            return outputFilePath;
        }

        public string GetOutputMimeType(ConversionType type) => type switch
        {
            ConversionType.PdfToWord or ConversionType.PdfToDocx or ConversionType.TxtToDocx => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ConversionType.PdfToExcel or ConversionType.CsvToXlsx => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ConversionType.WordToPdf or ConversionType.DocxToPdf or ConversionType.TxtToPdf or ConversionType.ImageToPdf => "application/pdf",
            ConversionType.PdfToTxt or ConversionType.DocToTxt => "text/plain",
            ConversionType.PdfToHtml or ConversionType.TxtToHtml => "text/html",
            ConversionType.Zip => "application/zip",
            ConversionType.PdfToJpg => "image/jpeg",
            _ => "application/octet-stream"
        };

        public string GetOutputFileName(string originalFileName, ConversionType type)
            => $"{Path.GetFileNameWithoutExtension(originalFileName)}-converted{GetExtension(type)}";

        public ConversionType ParseConversionType(string typeStr) => ConversionType.Unknown;

        private string GetExtension(ConversionType type) => type switch
        {
            ConversionType.PdfToWord or ConversionType.PdfToDocx or ConversionType.TxtToDocx or ConversionType.HtmlToDocx or ConversionType.EpubToDocx => ".docx",
            ConversionType.PdfToExcel or ConversionType.PdfToXlsx or ConversionType.CsvToXlsx => ".xlsx",
            ConversionType.PdfToTxt or ConversionType.DocToTxt or ConversionType.EpubToTxt => ".txt",
            ConversionType.PdfToHtml or ConversionType.TxtToHtml or ConversionType.DocToHtml => ".html",
            ConversionType.PdfToEpub or ConversionType.TxtToEpub => ".epub",
            ConversionType.WordToPdf or ConversionType.DocxToPdf or ConversionType.DocToPdf or ConversionType.TxtToPdf
                or ConversionType.ImageToPdf or ConversionType.JpgToPdf or ConversionType.PngToPdf
                or ConversionType.HeicToPdf or ConversionType.TiffToPdf or ConversionType.EpubToPdf
                or ConversionType.HtmlToPdf or ConversionType.PptToPdf or ConversionType.PptxToPdf
                or ConversionType.XlsToPdf or ConversionType.XlsxToPdf or ConversionType.ExcelToPdf
                or ConversionType.SvgToPdf or ConversionType.AiToPdf or ConversionType.EpsToPdf => ".pdf",
            ConversionType.XlsToCsv or ConversionType.XlsxToCsv => ".csv",
            ConversionType.XlsToJson or ConversionType.XlsxToJson => ".json",
            ConversionType.PdfToJpg or ConversionType.PptToJpg => ".jpg",
            ConversionType.PptToPng => ".png",
            ConversionType.Zip or ConversionType.Archive => ".zip",
            _ => ".tmp"
        };

        // ── Conversion Implementations ────────────────────────────────────────

        private void ConvertPdfToWord(string src, string dst)
        {
            using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(new PdfReader(src));
            using var wordDoc = WordprocessingDocument.Create(dst, WordprocessingDocumentType.Document);
            var mainPart = wordDoc.AddMainDocumentPart();
            mainPart.Document = new Wp.Document();
            var body = mainPart.Document.AppendChild(new Wp.Body());
            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
            {
                var text = PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i), new LocationTextExtractionStrategy());
                foreach (var line in text.Split('\n'))
                {
                    var para = new Wp.Paragraph();
                    var run = new Wp.Run();
                    run.AppendChild(new Wp.Text(line));
                    para.AppendChild(run);
                    body.AppendChild(para);
                }
            }
        }

        private void ConvertPdfToTxt(string src, string dst)
        {
            using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(new PdfReader(src));
            var sb = new System.Text.StringBuilder();
            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                sb.AppendLine(PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i), new LocationTextExtractionStrategy()));
            File.WriteAllText(dst, sb.ToString());
        }

        private void ConvertPdfToHtml(string src, string dst)
        {
            using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(new PdfReader(src));
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Converted</title></head><body>");
            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
            {
                var text = PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i), new LocationTextExtractionStrategy());
                foreach (var line in text.Split('\n'))
                    sb.AppendLine($"<p>{System.Net.WebUtility.HtmlEncode(line)}</p>");
            }
            sb.AppendLine("</body></html>");
            File.WriteAllText(dst, sb.ToString());
        }

        private void ConvertPdfToExcel(string src, string dst)
        {
            using var spreadsheet = SpreadsheetDocument.Create(dst, SpreadsheetDocumentType.Workbook);
            var workbookPart = spreadsheet.AddWorkbookPart();
            workbookPart.Workbook = new DocumentFormat.OpenXml.Spreadsheet.Workbook();
            var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            var sheetData = new DocumentFormat.OpenXml.Spreadsheet.SheetData();
            worksheetPart.Worksheet = new DocumentFormat.OpenXml.Spreadsheet.Worksheet(sheetData);
            var sheets = spreadsheet.WorkbookPart!.Workbook.AppendChild(new DocumentFormat.OpenXml.Spreadsheet.Sheets());
            sheets.Append(new DocumentFormat.OpenXml.Spreadsheet.Sheet
            {
                Id = spreadsheet.WorkbookPart.GetIdOfPart(worksheetPart),
                SheetId = 1,
                Name = "Sheet1"
            });
            using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(new PdfReader(src));
            uint rowIdx = 1;
            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
            {
                var text = PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i), new LocationTextExtractionStrategy());
                foreach (var line in text.Split('\n'))
                {
                    if (string.IsNullOrWhiteSpace(line)) continue;
                    var row = new DocumentFormat.OpenXml.Spreadsheet.Row { RowIndex = rowIdx++ };
                    foreach (var cell in line.Split('\t', ' ').Where(c => !string.IsNullOrWhiteSpace(c)))
                        row.Append(new DocumentFormat.OpenXml.Spreadsheet.Cell
                        {
                            DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String,
                            CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(cell)
                        });
                    sheetData.Append(row);
                }
            }
        }

        private void ConvertWordToPdf(string src, string dst)
        {
            using var wordDoc = WordprocessingDocument.Open(src, false);
            var body = wordDoc.MainDocumentPart?.Document.Body;
            using var writer = new PdfWriter(dst);
            using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
            using var document = new iTextLayout.Document(pdf);
            if (body != null)
                foreach (var el in body.Elements())
                    if (el is Wp.Paragraph p)
                        document.Add(new iTextElt.Paragraph(string.IsNullOrWhiteSpace(p.InnerText) ? "\n" : p.InnerText));
        }

        private void ConvertDocToTxt(string src, string dst)
        {
            using var wordDoc = WordprocessingDocument.Open(src, false);
            var text = wordDoc.MainDocumentPart?.Document.Body?.InnerText ?? string.Empty;
            File.WriteAllText(dst, text);
        }

        private void ConvertDocToHtml(string src, string dst)
        {
            using var wordDoc = WordprocessingDocument.Open(src, false);
            var body = wordDoc.MainDocumentPart?.Document.Body;
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head><body>");
            if (body != null)
                foreach (var el in body.Elements())
                    if (el is Wp.Paragraph p)
                        sb.AppendLine($"<p>{System.Net.WebUtility.HtmlEncode(p.InnerText)}</p>");
            sb.AppendLine("</body></html>");
            File.WriteAllText(dst, sb.ToString());
        }

        private void ConvertTxtToPdf(string src, string dst)
        {
            var text = File.ReadAllText(src);
            using var writer = new PdfWriter(dst);
            using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
            using var document = new iTextLayout.Document(pdf);
            document.Add(new iTextElt.Paragraph(text));
        }

        private void ConvertTxtToDocx(string src, string dst)
        {
            var text = File.ReadAllText(src);
            using var wordDoc = WordprocessingDocument.Create(dst, WordprocessingDocumentType.Document);
            var mainPart = wordDoc.AddMainDocumentPart();
            mainPart.Document = new Wp.Document();
            var body = mainPart.Document.AppendChild(new Wp.Body());
            foreach (var line in text.Split('\n'))
            {
                var para = new Wp.Paragraph();
                var run = new Wp.Run();
                run.AppendChild(new Wp.Text(line));
                para.AppendChild(run);
                body.AppendChild(para);
            }
        }

        private void ConvertTxtToHtml(string src, string dst)
        {
            var text = File.ReadAllText(src);
            var lines = text.Split('\n').Select(l => $"<p>{System.Net.WebUtility.HtmlEncode(l)}</p>");
            File.WriteAllText(dst, $"<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head><body>{string.Join("\n", lines)}</body></html>");
        }

        private void ConvertOfficeToPdf(string src, string dst)
        {
            // Try LibreOffice first, then fallback
            var sofficePaths = new[]
            {
                "/usr/bin/soffice",
                "/usr/lib/libreoffice/program/soffice",
                @"C:\Program Files\LibreOffice\program\soffice.exe",
                @"C:\Program Files (x86)\LibreOffice\program\soffice.exe"
            };
            var soffice = sofficePaths.FirstOrDefault(File.Exists);
            if (soffice != null)
            {
                var outDir = Path.GetDirectoryName(dst)!;
                var process = new System.Diagnostics.Process
                {
                    StartInfo = new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = soffice,
                        Arguments = $"--headless --convert-to pdf \"{src}\" --outdir \"{outDir}\"",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };
                process.Start();
                process.WaitForExit(60000);
                // LibreOffice outputs to same dir with original name + .pdf
                var libreOutFile = Path.Combine(outDir, Path.GetFileNameWithoutExtension(src) + ".pdf");
                if (File.Exists(libreOutFile) && libreOutFile != dst)
                    File.Move(libreOutFile, dst, true);
                if (File.Exists(dst)) return;
            }
            // Fallback: write a placeholder PDF noting the limitation
            using var writer = new PdfWriter(dst);
            using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
            using var doc = new iTextLayout.Document(pdf);
            doc.Add(new iTextElt.Paragraph($"Note: LibreOffice is required for full PPT/Excel-to-PDF conversion.\nFile: {Path.GetFileName(src)}"));
        }

        private void ConvertOfficeToCsv(string src, string dst)
        {
            // Basic: use LibreOffice if available
            var sofficePaths = new[]
            {
                "/usr/bin/soffice",
                @"C:\Program Files\LibreOffice\program\soffice.exe"
            };
            var soffice = sofficePaths.FirstOrDefault(File.Exists);
            if (soffice != null)
            {
                var outDir = Path.GetDirectoryName(dst)!;
                var process = new System.Diagnostics.Process
                {
                    StartInfo = new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = soffice,
                        Arguments = $"--headless --convert-to csv \"{src}\" --outdir \"{outDir}\"",
                        RedirectStandardOutput = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };
                process.Start();
                process.WaitForExit(60000);
                var libreOut = Path.Combine(outDir, Path.GetFileNameWithoutExtension(src) + ".csv");
                if (File.Exists(libreOut) && libreOut != dst)
                    File.Move(libreOut, dst, true);
                if (File.Exists(dst)) return;
            }
            File.WriteAllText(dst, "Column1,Column2\nLibreOffice required for full conversion");
        }

        private void ConvertOfficeToJson(string src, string dst)
        {
            File.WriteAllText(dst, "[{\"note\":\"LibreOffice required for full Excel-to-JSON conversion\"}]");
        }

        private void ConvertCsvToXlsx(string src, string dst)
        {
            var lines = File.ReadAllLines(src);
            using var spreadsheet = SpreadsheetDocument.Create(dst, SpreadsheetDocumentType.Workbook);
            var workbookPart = spreadsheet.AddWorkbookPart();
            workbookPart.Workbook = new DocumentFormat.OpenXml.Spreadsheet.Workbook();
            var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            var sheetData = new DocumentFormat.OpenXml.Spreadsheet.SheetData();
            worksheetPart.Worksheet = new DocumentFormat.OpenXml.Spreadsheet.Worksheet(sheetData);
            var sheets = spreadsheet.WorkbookPart!.Workbook.AppendChild(new DocumentFormat.OpenXml.Spreadsheet.Sheets());
            sheets.Append(new DocumentFormat.OpenXml.Spreadsheet.Sheet
            {
                Id = spreadsheet.WorkbookPart.GetIdOfPart(worksheetPart),
                SheetId = 1,
                Name = "Sheet1"
            });
            uint rowIdx = 1;
            foreach (var line in lines)
            {
                var row = new DocumentFormat.OpenXml.Spreadsheet.Row { RowIndex = rowIdx++ };
                foreach (var cell in line.Split(','))
                    row.Append(new DocumentFormat.OpenXml.Spreadsheet.Cell
                    {
                        DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String,
                        CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(cell.Trim('"'))
                    });
                sheetData.Append(row);
            }
        }

        private void ConvertImageToPdf(string src, string dst)
        {
            using var writer = new PdfWriter(dst);
            using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
            using var doc = new iTextLayout.Document(pdf);
            var imgData = iText.IO.Image.ImageDataFactory.Create(src);
            var img = new iTextElt.Image(imgData);
            img.SetAutoScale(true);
            doc.Add(img);
        }

        private void ConvertHtmlToPdf(string src, string dst)
        {
            var html = File.ReadAllText(src);
            using var writer = new PdfWriter(dst);
            using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
            using var doc = new iTextLayout.Document(pdf);
            // Strip tags for basic conversion
            var text = System.Text.RegularExpressions.Regex.Replace(html, "<[^>]*>", "");
            doc.Add(new iTextElt.Paragraph(text));
        }

        private void ConvertHtmlToDocx(string src, string dst)
        {
            var html = File.ReadAllText(src);
            var text = System.Text.RegularExpressions.Regex.Replace(html, "<[^>]*>", "");
            using var wordDoc = WordprocessingDocument.Create(dst, WordprocessingDocumentType.Document);
            var mainPart = wordDoc.AddMainDocumentPart();
            mainPart.Document = new Wp.Document();
            var body = mainPart.Document.AppendChild(new Wp.Body());
            foreach (var line in text.Split('\n'))
            {
                var para = new Wp.Paragraph();
                var run = new Wp.Run();
                run.AppendChild(new Wp.Text(line));
                para.AppendChild(run);
                body.AppendChild(para);
            }
        }

        private void ConvertEpubToPdf(string src, string dst)
        {
            using var writer = new PdfWriter(dst);
            using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
            using var doc = new iTextLayout.Document(pdf);
            doc.Add(new iTextElt.Paragraph($"EPUB to PDF conversion requires iText EPUB handler.\nOriginal: {Path.GetFileName(src)}"));
        }

        private void CreateZip(string src, string dst)
        {
            using var archive = ZipFile.Open(dst, ZipArchiveMode.Create);
            archive.CreateEntryFromFile(src, Path.GetFileName(src));
        }

        private void ExtractZip(string src, string dst)
        {
            using var archive = ZipFile.OpenRead(src);
            var entry = archive.Entries.FirstOrDefault();
            if (entry != null)
                entry.ExtractToFile(dst, true);
            else
                throw new InvalidOperationException("ZIP archive is empty.");
        }
    }
}
