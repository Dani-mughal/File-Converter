using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using iText.Kernel.Geom;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Kernel.Font;
using iText.IO.Font.Constants;
using iTextData = iText.Kernel.Pdf.Canvas.Parser.Data;
using System.Diagnostics;
using System.Text.RegularExpressions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using PuppeteerSharp;

// Aliases to avoid ambiguity
using Wp = DocumentFormat.OpenXml.Wordprocessing;
using iTextLayout = iText.Layout;
using iTextElt = iText.Layout.Element;
using Path = System.IO.Path;
using Rectangle = iText.Kernel.Geom.Rectangle;

namespace ConvertHub.Api.Services.Implementation
{
    public class PdfConversionService : IConversionService
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly ILogger<PdfConversionService> _logger;
        private readonly IConfiguration _configuration;

        public PdfConversionService(
            IFileStorageService fileStorageService,
            IConfiguration configuration,
            ILogger<PdfConversionService> logger)
        {
            _fileStorageService = fileStorageService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType)
        {
            var outputFileName = $"{Guid.NewGuid()}{GetExtension(conversionType)}";
            var outputFilePath = Path.Combine(_fileStorageService.GetTempDirectory(), outputFileName);

            _logger.LogInformation("[PDF SERVICE] Converting {Type}: {Src} → {Dst}", conversionType, sourceFilePath, outputFilePath);

            switch (conversionType)
            {
                case ConversionType.PdfToWord:
                case ConversionType.PdfToDocx:
                    await ConvertPdfToWord(sourceFilePath, outputFilePath);
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
                case ConversionType.WordToPdf:
                case ConversionType.DocxToPdf:
                case ConversionType.DocToPdf:
                case ConversionType.TxtToPdf:
                case ConversionType.PptToPdf:
                case ConversionType.PptxToPdf:
                case ConversionType.XlsToPdf:
                case ConversionType.XlsxToPdf:
                case ConversionType.ExcelToPdf:
                case ConversionType.HtmlToPdf:
                    await Task.Run(() => ConvertOfficeToPdf(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.TxtToDocx:
                    await Task.Run(() => ConvertTxtToDocx(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.TxtToHtml:
                    await Task.Run(() => ConvertTxtToHtml(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.EpubToPdf:
                    await Task.Run(() => ConvertEpubToPdf(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.MergePdf:
                    await Task.Run(() => MergePdfs(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.SplitPdf:
                    await Task.Run(() => SplitPdf(sourceFilePath, outputFilePath));
                    break;
                case ConversionType.CompressPdf:
                    await Task.Run(() => CompressPdf(sourceFilePath, outputFilePath));
                    break;
                default:
                    throw new NotSupportedException($"PDF Service does not support conversion '{conversionType}'.");
            }

            await ValidateOutputFile(outputFilePath, conversionType);
            return outputFilePath;
        }

        private async Task ValidateOutputFile(string path, ConversionType type)
        {
            if (!File.Exists(path))
                throw new InvalidOperationException($"Conversion failed: Output was not created for {type}.");

            var info = new FileInfo(path);
            if (info.Length == 0)
            {
                File.Delete(path);
                throw new InvalidOperationException($"Conversion failed: Output file is empty for {type}.");
            }

            if (Path.GetExtension(path).ToLowerInvariant() == ".pdf")
            {
                using var fs = new FileStream(path, FileMode.Open, FileAccess.Read);
                var header = new byte[5];
                await fs.ReadAsync(header, 0, 5);
                if (System.Text.Encoding.ASCII.GetString(header) != "%PDF-")
                {
                    fs.Close();
                    File.Delete(path);
                    throw new InvalidOperationException("Conversion failed: Output is not a valid PDF.");
                }
            }
        }

        public string GetOutputMimeType(ConversionType type) => type switch
        {
            ConversionType.PdfToWord or ConversionType.PdfToDocx or ConversionType.TxtToDocx => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ConversionType.PdfToExcel or ConversionType.PdfToXlsx => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ConversionType.WordToPdf or ConversionType.DocxToPdf or ConversionType.TxtToPdf or ConversionType.ImageToPdf or ConversionType.HtmlToPdf => "application/pdf",
            ConversionType.PdfToTxt => "text/plain",
            ConversionType.PdfToHtml or ConversionType.TxtToHtml => "text/html",
            _ => "application/octet-stream"
        };

        public string GetOutputFileName(string originalFileName, ConversionType type)
            => $"{Path.GetFileNameWithoutExtension(originalFileName)}-converted{GetExtension(type)}";

        public ConversionType ParseConversionType(string typeStr) => ConversionType.Unknown;

        private string GetExtension(ConversionType type) => type switch
        {
            ConversionType.PdfToWord or ConversionType.PdfToDocx or ConversionType.TxtToDocx or ConversionType.HtmlToDocx or ConversionType.EpubToDocx => ".docx",
            ConversionType.PdfToExcel or ConversionType.PdfToXlsx => ".xlsx",
            ConversionType.PdfToTxt => ".txt",
            ConversionType.PdfToHtml or ConversionType.TxtToHtml => ".html",
            ConversionType.WordToPdf or ConversionType.DocxToPdf or ConversionType.DocToPdf or ConversionType.TxtToPdf
                or ConversionType.ImageToPdf or ConversionType.HtmlToPdf or ConversionType.PptToPdf or ConversionType.PptxToPdf
                or ConversionType.XlsToPdf or ConversionType.XlsxToPdf or ConversionType.ExcelToPdf or ConversionType.EpubToPdf => ".pdf",
            _ => ".tmp"
        };

        // ── PDF to Word Implementation ────────────────────────────────────────

        private async Task ConvertPdfToWord(string src, string dst)
        {
            try
            {
                string pdf2docxPath = FindPdf2Docx();
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = pdf2docxPath,
                        Arguments = $"convert \"{src}\" \"{dst}\"",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };

                process.Start();
                if (await Task.Run(() => process.WaitForExit(180000))) // 3 min timeout
                {
                    if (File.Exists(dst)) return;
                }
                else
                {
                    process.Kill();
                }
            }
            catch { }

            _logger.LogInformation("[PDF SERVICE] Running High-Fidelity Fallback Engine...");
            await ConvertPdfToWordHighFidelity(src, dst);
        }

        private string FindPdf2Docx()
        {
            if (OperatingSystem.IsLinux()) return "pdf2docx";
            if (OperatingSystem.IsWindows())
            {
                var userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
                var paths = new[]
                {
                    Path.Combine(userProfile, @"AppData\Roaming\Python\Python310\Scripts\pdf2docx.exe"),
                    Path.Combine(userProfile, @"AppData\Local\Programs\Python\Python310\Scripts\pdf2docx.exe"),
                    "pdf2docx.exe"
                };
                return paths.FirstOrDefault(File.Exists) ?? "pdf2docx";
            }
            return "pdf2docx";
        }

        private async Task ConvertPdfToWordHighFidelity(string src, string dst)
        {
            await Task.Run(() =>
            {
                using var reader = new PdfReader(src);
                using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(reader);
                using var wordDoc = WordprocessingDocument.Create(dst, WordprocessingDocumentType.Document);

                var mainPart = wordDoc.AddMainDocumentPart();
                mainPart.Document = new Wp.Document();
                var body = mainPart.Document.AppendChild(new Wp.Body());

                for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                {
                    var page = pdfDoc.GetPage(i);
                    var strategy = new LayoutAwareExtractionStrategy();
                    PdfCanvasProcessor processor = new PdfCanvasProcessor(strategy);
                    processor.ProcessPageContent(page);

                    var elements = strategy.GetElements();
                    var rows = GroupElementsByRows(elements);
                    foreach (var row in rows)
                    {
                        if (IsTable(row)) body.Append(CreateTable(row));
                        else body.Append(CreateParagraph(row));
                    }

                    foreach (var img in strategy.GetImages())
                    {
                        InsertImage(mainPart, body, img);
                    }

                    if (i < pdfDoc.GetNumberOfPages())
                        body.Append(new Wp.Paragraph(new Wp.Run(new Wp.Break { Type = Wp.BreakValues.Page })));
                }

                var lastPageSize = pdfDoc.GetPage(pdfDoc.GetNumberOfPages()).GetPageSize();
                body.Append(new Wp.SectionProperties(new Wp.PageSize
                {
                    Width = new UInt32Value((uint)(lastPageSize.GetWidth() * 20)),
                    Height = new UInt32Value((uint)(lastPageSize.GetHeight() * 20))
                }));

                wordDoc.Save();
            });
        }

        private class LayoutElement
        {
            public string Text { get; set; } = string.Empty;
            public Rectangle Rect { get; set; } = new Rectangle(0, 0, 0, 0);
            public float FontSize { get; set; } = 10f;
            public bool IsBold { get; set; }
        }

        private class ImageElement
        {
            public byte[] Bytes { get; set; } = Array.Empty<byte>();
            public Rectangle Rect { get; set; } = new Rectangle(0, 0, 0, 0);
            public string Extension { get; set; } = "png";
        }

        private class LayoutAwareExtractionStrategy : IEventListener
        {
            private readonly List<LayoutElement> _elements = new();
            private readonly List<ImageElement> _images = new();

            public void EventOccurred(iTextData.IEventData data, EventType type)
            {
                if (type == EventType.RENDER_TEXT && data is iTextData.TextRenderInfo info)
                {
                    var text = info.GetText();
                    if (string.IsNullOrWhiteSpace(text)) return;

                    _elements.Add(new LayoutElement
                    {
                        Text = text,
                        Rect = info.GetDescentLine().GetBoundingRectangle(),
                        FontSize = info.GetFontSize(),
                        IsBold = info.GetFont().GetFontProgram().GetFontNames().GetFontName().ToLower().Contains("bold")
                    });
                }
                else if (type == EventType.RENDER_IMAGE && data is iTextData.ImageRenderInfo imageInfo)
                {
                    try
                    {
                        var img = imageInfo.GetImage();
                        var matrix = imageInfo.GetImageCtm();
                        _images.Add(new ImageElement
                        {
                            Bytes = img.GetImageBytes(),
                            Rect = new Rectangle(matrix.Get(6), matrix.Get(7), matrix.Get(0), matrix.Get(3)),
                            Extension = img.IdentifyImageFileExtension()
                        });
                    }
                    catch { }
                }
            }

            public ICollection<EventType> GetSupportedEvents() => new[] { EventType.RENDER_TEXT, EventType.RENDER_IMAGE };
            public List<LayoutElement> GetElements() => _elements.OrderByDescending(e => e.Rect.GetY()).ThenBy(e => e.Rect.GetX()).ToList();
            public List<ImageElement> GetImages() => _images;
        }

        private List<List<LayoutElement>> GroupElementsByRows(List<LayoutElement> elements)
        {
            var rows = new List<List<LayoutElement>>();
            if (elements.Count == 0) return rows;

            var currentRow = new List<LayoutElement> { elements[0] };
            for (int i = 1; i < elements.Count; i++)
            {
                if (Math.Abs(elements[i].Rect.GetY() - elements[i - 1].Rect.GetY()) < 5) currentRow.Add(elements[i]);
                else { rows.Add(currentRow); currentRow = new List<LayoutElement> { elements[i] }; }
            }
            rows.Add(currentRow);
            return rows;
        }

        private bool IsTable(List<LayoutElement> row)
        {
            if (row.Count < 2) return false;
            for (int i = 1; i < row.Count; i++)
                if (row[i].Rect.GetX() - (row[i - 1].Rect.GetX() + row[i - 1].Rect.GetWidth()) > 40) return true;
            return false;
        }

        private Wp.Paragraph CreateParagraph(List<LayoutElement> row)
        {
            var para = new Wp.Paragraph();
            var paraProps = new Wp.ParagraphProperties();
            if (row.Min(e => e.Rect.GetX()) > 150) paraProps.Append(new Wp.Justification { Val = Wp.JustificationValues.Center });
            para.Append(paraProps);

            foreach (var el in row)
            {
                var run = new Wp.Run();
                var runProps = new Wp.RunProperties();
                if (el.IsBold) runProps.Append(new Wp.Bold());
                runProps.Append(new Wp.FontSize { Val = (el.FontSize * 2).ToString() });
                run.Append(runProps);
                run.AppendChild(new Wp.Text(el.Text) { Space = SpaceProcessingModeValues.Preserve });
                para.Append(run);
            }
            return para;
        }

        private Wp.Table CreateTable(List<LayoutElement> row)
        {
            var table = new Wp.Table();
            var tr = new Wp.TableRow();
            var cells = new List<List<LayoutElement>>();
            var currentCell = new List<LayoutElement> { row[0] };
            for (int i = 1; i < row.Count; i++)
            {
                if (row[i].Rect.GetX() - (row[i - 1].Rect.GetX() + row[i - 1].Rect.GetWidth()) > 30) { cells.Add(currentCell); currentCell = new List<LayoutElement> { row[i] }; }
                else currentCell.Add(row[i]);
            }
            cells.Add(currentCell);

            foreach (var cellGroup in cells)
            {
                var tc = new Wp.TableCell();
                tc.Append(new Wp.TableCellProperties(new Wp.TableCellWidth { Type = Wp.TableWidthUnitValues.Auto }));
                tc.Append(CreateParagraph(cellGroup));
                tr.Append(tc);
            }
            table.Append(tr);
            return table;
        }

        private void InsertImage(MainDocumentPart mainPart, Wp.Body body, ImageElement img)
        {
            try
            {
                var imagePart = mainPart.AddImagePart(img.Extension.ToLower() == "jpg" ? ImagePartType.Jpeg : ImagePartType.Png);
                using (var stream = new MemoryStream(img.Bytes)) imagePart.FeedData(stream);

                var relationshipId = mainPart.GetIdOfPart(imagePart);
                var drawing = new Wp.Paragraph(new Wp.Run(new Wp.Drawing(new DocumentFormat.OpenXml.Drawing.Wordprocessing.Inline(
                    new DocumentFormat.OpenXml.Drawing.Wordprocessing.Extent { Cx = (long)(img.Rect.GetWidth() * 9525), Cy = (long)(img.Rect.GetHeight() * 9525) },
                    new DocumentFormat.OpenXml.Drawing.Wordprocessing.EffectExtent { LeftEdge = 0L, TopEdge = 0L, RightEdge = 0L, BottomEdge = 0L },
                    new DocumentFormat.OpenXml.Drawing.Wordprocessing.DocProperties { Id = (UInt32Value)1U, Name = "Image" },
                    new DocumentFormat.OpenXml.Drawing.Wordprocessing.NonVisualGraphicFrameDrawingProperties(new DocumentFormat.OpenXml.Drawing.GraphicFrameLocks { NoChangeAspect = true }),
                    new DocumentFormat.OpenXml.Drawing.Graphic(new DocumentFormat.OpenXml.Drawing.GraphicData(
                        new DocumentFormat.OpenXml.Drawing.Pictures.Picture(
                            new DocumentFormat.OpenXml.Drawing.Pictures.NonVisualPictureProperties(new DocumentFormat.OpenXml.Drawing.Pictures.NonVisualDrawingProperties { Id = (UInt32Value)0U, Name = "Image.png" }),
                            new DocumentFormat.OpenXml.Drawing.Pictures.BlipFill(new DocumentFormat.OpenXml.Drawing.Blip { Embed = relationshipId, CompressionState = DocumentFormat.OpenXml.Drawing.BlipCompressionValues.Print }, new DocumentFormat.OpenXml.Drawing.Stretch(new DocumentFormat.OpenXml.Drawing.FillRectangle())),
                            new DocumentFormat.OpenXml.Drawing.Pictures.ShapeProperties(new DocumentFormat.OpenXml.Drawing.Transform2D(new DocumentFormat.OpenXml.Drawing.Offset { X = 0L, Y = 0L }, new DocumentFormat.OpenXml.Drawing.Extents { Cx = (long)(img.Rect.GetWidth() * 9525), Cy = (long)(img.Rect.GetHeight() * 9525) }), new DocumentFormat.OpenXml.Drawing.PresetGeometry { Preset = DocumentFormat.OpenXml.Drawing.ShapeTypeValues.Rectangle }))
                    ) { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" })
                ) { DistanceFromTop = 0U, DistanceFromBottom = 0U, DistanceFromLeft = 0U, DistanceFromRight = 0U })));
                body.Append(drawing);
            }
            catch { }
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
            sb.AppendLine("<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head><body>");
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
            var sheets = spreadsheet.WorkbookPart.Workbook.AppendChild(new DocumentFormat.OpenXml.Spreadsheet.Sheets());
            sheets.Append(new DocumentFormat.OpenXml.Spreadsheet.Sheet { Id = spreadsheet.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "Sheet1" });

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
                        row.Append(new DocumentFormat.OpenXml.Spreadsheet.Cell { DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String, CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(cell) });
                    sheetData.Append(row);
                }
            }
        }

        private void ConvertOfficeToPdf(string src, string dst)
        {
            string soffice = ResolveLibreOfficePath();
            _logger.LogInformation("[PDF SERVICE] Using LibreOffice at: {Path}", soffice);

            if (!File.Exists(soffice) && !OperatingSystem.IsLinux())
            {
                throw new FileNotFoundException($"LibreOffice not found at '{soffice}'. Please install LibreOffice or configure 'LibreOfficePath' in appsettings.json.");
            }

            var outDir = Path.GetDirectoryName(dst)!;
            var process = new Process { StartInfo = new ProcessStartInfo { FileName = soffice, Arguments = $"--headless --convert-to pdf \"{src}\" --outdir \"{outDir}\"", UseShellExecute = false, CreateNoWindow = true } };
            process.Start();
            process.WaitForExit(60000);
            var outFile = Path.Combine(outDir, Path.GetFileNameWithoutExtension(src) + ".pdf");
            if (File.Exists(outFile) && outFile != dst) File.Move(outFile, dst, true);
        }

        private string ResolveLibreOfficePath()
        {
            // 1. Check Config
            var configPath = _configuration["LibreOfficePath"];
            if (!string.IsNullOrEmpty(configPath) && File.Exists(configPath)) return configPath;

            // 2. Standard Windows Paths
            if (OperatingSystem.IsWindows())
            {
                var paths = new[]
                {
                    @"C:\Program Files\LibreOffice\program\soffice.exe",
                    @"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"LibreOffice\program\soffice.exe")
                };
                foreach (var p in paths) if (File.Exists(p)) return p;
            }

            // 3. Fallback to PATH
            return "soffice";
        }

        private void ConvertTxtToDocx(string src, string dst)
        {
            using var wordDoc = WordprocessingDocument.Create(dst, WordprocessingDocumentType.Document);
            var mainPart = wordDoc.AddMainDocumentPart();
            mainPart.Document = new Wp.Document(new Wp.Body());
            foreach (var line in File.ReadAllLines(src))
                mainPart.Document.Body.AppendChild(new Wp.Paragraph(new Wp.Run(new Wp.Text(line))));
        }

        private void ConvertTxtToHtml(string src, string dst)
        {
            var lines = File.ReadAllLines(src).Select(l => $"<p>{System.Net.WebUtility.HtmlEncode(l)}</p>");
            File.WriteAllText(dst, $"<html><body>{string.Join("\n", lines)}</body></html>");
        }

        private void ConvertEpubToPdf(string src, string dst) { }

        private void MergePdfs(string srcDir, string dst)
        {
            using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(new PdfWriter(dst));
            var merger = new iText.Kernel.Utils.PdfMerger(pdfDoc);
            
            var files = Directory.GetFiles(srcDir).OrderBy(f => f);
            foreach (var f in files)
            {
                using var readerDoc = new iText.Kernel.Pdf.PdfDocument(new PdfReader(f));
                merger.Merge(readerDoc, 1, readerDoc.GetNumberOfPages());
            }
        }

        private void SplitPdf(string src, string dstDir)
        {
            using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(new PdfReader(src));
            var name = Path.GetFileNameWithoutExtension(src);
            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
            {
                var outPath = Path.Combine(dstDir, $"{name}_page_{i}.pdf");
                using var outDoc = new iText.Kernel.Pdf.PdfDocument(new PdfWriter(outPath));
                pdfDoc.CopyPagesTo(i, i, outDoc);
            }
        }

        private void CompressPdf(string src, string dst)
        {
            var writerProps = new WriterProperties().SetFullCompressionMode(true).SetCompressionLevel(9);
            using var reader = new PdfReader(src);
            using var writer = new PdfWriter(dst, writerProps);
            using var pdfDoc = new iText.Kernel.Pdf.PdfDocument(reader, writer);
            pdfDoc.GetWriter().SetCompressionLevel(9);
        }
    }
}
