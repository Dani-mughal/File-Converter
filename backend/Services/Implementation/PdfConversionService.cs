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
                /*case ConversionType.TxtToDocx:
                    await Task.Run(() => ConvertTxtToDocx(sourceFilePath, outputFilePath));
                    break;*/
                /*case ConversionType.TxtToHtml:
                    await Task.Run(() => ConvertTxtToHtml(sourceFilePath, outputFilePath));
                    break;*/
                case ConversionType.PptToJpg:
                case ConversionType.PptToPng:
                    await Task.Run(() => ConvertOfficeToPdf(sourceFilePath, outputFilePath));
                    break;

                // Excel → CSV/JSON/PDF
                case ConversionType.XlsToCsv:
                case ConversionType.XlsxToCsv:
                    await Task.Run(() => ConvertOfficeToCsv(sourceFilePath, outputFilePath));
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
                case ConversionType.SvgToPdf:
                case ConversionType.AiToPdf:
                case ConversionType.PsdToPdf:
                case ConversionType.EpsToPdf:
                    await Task.Run(() => ConvertImageToPdf(sourceFilePath, outputFilePath));
                    break;

                // HTML → PDF/Docx
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

                /*case ConversionType.EpubToPdf:
                    await Task.Run(() => ConvertEpubToPdf(sourceFilePath, outputFilePath));
                    break;*/
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
                
                if (OperatingSystem.IsLinux())
                {
                    // Use /usr/bin/python3 -m pdf2docx for maximum compatibility on Linux/Docker
                    process.StartInfo.FileName = "/usr/bin/python3";
                    process.StartInfo.Arguments = $"-m pdf2docx convert \"{src}\" \"{dst}\"";
                }

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

                // Setup Default Styles
                SetupDocxStyles(mainPart);

                for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                {
                    var page = pdfDoc.GetPage(i);
                    var pageSize = page.GetPageSize();
                    var strategy = new AdvancedLayoutStrategy();
                    PdfCanvasProcessor processor = new PdfCanvasProcessor(strategy);
                    processor.ProcessPageContent(page);

                    var elements = strategy.GetElements();
                    var images = strategy.GetImages();

                    // 1. Word Spacing Reconstruction
                    ReconstructWords(elements);

                    // 2. Column Detection & Layout Analysis
                    var columns = DetectColumns(elements, pageSize.GetWidth());

                    // 3. Process Content by Reading Order (Column then Y)
                    foreach (var column in columns.OrderBy(c => c.X))
                    {
                        var colElements = column.Elements;
                        var colImages = images.Where(img => img.Rect.GetX() >= column.X && img.Rect.GetX() < column.X + column.Width).ToList();

                        // Combine and sort by Y (Top to Bottom)
                        var sortedContent = colElements.Cast<IPageElement>()
                            .Concat(colImages.Cast<IPageElement>())
                            .OrderByDescending(e => e.Rect.GetY())
                            .ToList();

                        // 4. Section & Paragraph Grouping
                        LayoutParagraph? currentPara = null;
                        
                        foreach (var item in sortedContent)
                        {
                            if (item is LayoutElement el)
                            {
                                if (currentPara == null || IsNewParagraph(currentPara, el))
                                {
                                    if (currentPara != null) body.Append(CreateParagraph(currentPara));
                                    currentPara = new LayoutParagraph();
                                }
                                currentPara.Elements.Add(el);
                            }
                            else if (item is ImageElement img)
                            {
                                if (currentPara != null)
                                {
                                    body.Append(CreateParagraph(currentPara));
                                    currentPara = null;
                                }
                                InsertImageIntoDocx(mainPart, body, img);
                            }
                        }
                        if (currentPara != null) body.Append(CreateParagraph(currentPara));
                    }

                    if (i < pdfDoc.GetNumberOfPages())
                        body.Append(new Wp.Paragraph(new Wp.Run(new Wp.Break { Type = Wp.BreakValues.Page })));
                }

                // Set Page Size for the whole document based on last page
                var lastPageSize = pdfDoc.GetPage(pdfDoc.GetNumberOfPages()).GetPageSize();
                body.Append(new Wp.SectionProperties(new Wp.PageSize
                {
                    Width = (UInt32Value)(uint)(lastPageSize.GetWidth() * 20),
                    Height = (UInt32Value)(uint)(lastPageSize.GetHeight() * 20)
                }));

                wordDoc.Save();
            });
        }

        private interface IPageElement { Rectangle Rect { get; } }

        private class LayoutElement : IPageElement
        {
            public string Text { get; set; } = string.Empty;
            public Rectangle Rect { get; set; } = new Rectangle(0, 0, 0, 0);
            public float FontSize { get; set; } = 10f;
            public string FontName { get; set; } = "Calibri";
            public bool IsBold { get; set; }
            public bool IsItalic { get; set; }
            public string ColorHex { get; set; } = "000000";
        }

        private class ImageElement : IPageElement
        {
            public byte[] Bytes { get; set; } = Array.Empty<byte>();
            public Rectangle Rect { get; set; } = new Rectangle(0, 0, 0, 0);
            public string Extension { get; set; } = "png";
        }

        private class LayoutParagraph
        {
            public List<LayoutElement> Elements { get; set; } = new();
            public Wp.JustificationValues Alignment { get; set; } = Wp.JustificationValues.Left;
        }

        private class LayoutColumn
        {
            public float X { get; set; }
            public float Width { get; set; }
            public List<LayoutElement> Elements { get; set; } = new();
        }

        private class AdvancedLayoutStrategy : IEventListener
        {
            private readonly List<LayoutElement> _elements = new();
            private readonly List<ImageElement> _images = new();

            public void EventOccurred(iTextData.IEventData data, EventType type)
            {
                if (type == EventType.RENDER_TEXT && data is iTextData.TextRenderInfo info)
                {
                    var text = info.GetText();
                    if (string.IsNullOrWhiteSpace(text)) return;

                    var baseline = info.GetBaseline().GetBoundingRectangle();
                    var ascent = info.GetAscentLine().GetBoundingRectangle();
                    
                    // Height is roughly Ascent - Baseline
                    float height = Math.Abs(ascent.GetY() - baseline.GetY());
                    if (height < 1) height = info.GetFontSize(); 

                    var rect = new Rectangle(baseline.GetX(), baseline.GetY(), info.GetDescentLine().GetEndPoint().Get(0) - baseline.GetX(), height);

                    _elements.Add(new LayoutElement
                    {
                        Text = text,
                        Rect = rect,
                        FontSize = info.GetFontSize(),
                        FontName = info.GetFont().GetFontProgram().GetFontNames().GetFontName(),
                        IsBold = info.GetFont().GetFontProgram().GetFontNames().GetFontName().ToLower().Contains("bold"),
                        IsItalic = info.GetFont().GetFontProgram().GetFontNames().GetFontName().ToLower().Contains("italic")
                    });
                }
                else if (type == EventType.RENDER_IMAGE && data is iTextData.ImageRenderInfo imgInfo)
                {
                    try
                    {
                        var img = imgInfo.GetImage();
                        var matrix = imgInfo.GetImageCtm();
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
            public List<LayoutElement> GetElements() => _elements;
            public List<ImageElement> GetImages() => _images;
        }

        private void ReconstructWords(List<LayoutElement> elements)
        {
            if (elements.Count < 2) return;

            // Sort by Y (desc) then X (asc)
            var sorted = elements.OrderByDescending(e => e.Rect.GetY()).ThenBy(e => e.Rect.GetX()).ToList();
            
            for (int i = 0; i < sorted.Count - 1; i++)
            {
                var current = sorted[i];
                var next = sorted[i + 1];

                // If on same line
                if (Math.Abs(current.Rect.GetY() - next.Rect.GetY()) < 3)
                {
                    float gap = next.Rect.GetX() - (current.Rect.GetX() + current.Rect.GetWidth());
                    float spaceThreshold = current.FontSize * 0.2f; // 20% of font size is a gap

                    if (gap > spaceThreshold && !current.Text.EndsWith(" ") && !next.Text.StartsWith(" "))
                    {
                        current.Text += " ";
                    }
                }
            }
        }

        private List<LayoutColumn> DetectColumns(List<LayoutElement> elements, float pageWidth)
        {
            var columns = new List<LayoutColumn>();
            if (!elements.Any()) return columns;

            // Simple column detection: Check for significant vertical gaps in X coordinates
            // This is a heuristic: we check if elements cluster around specific X ranges
            var xClusters = elements.Select(e => e.Rect.GetX()).OrderBy(x => x).ToList();
            
            // For now, let's assume 1 column if spread is small, or 2 if there's a big gap
            // A more advanced version would use a histogram
            float midPoint = pageWidth / 2;
            var leftSide = elements.Where(e => e.Rect.GetX() < midPoint).ToList();
            var rightSide = elements.Where(e => e.Rect.GetX() >= midPoint).ToList();

            if (rightSide.Count > elements.Count * 0.2) // If >20% is on the right, it's likely 2 columns
            {
                columns.Add(new LayoutColumn { X = 0, Width = midPoint, Elements = leftSide });
                columns.Add(new LayoutColumn { X = midPoint, Width = midPoint, Elements = rightSide });
            }
            else
            {
                columns.Add(new LayoutColumn { X = 0, Width = pageWidth, Elements = elements });
            }

            return columns;
        }

        private bool IsNewParagraph(LayoutParagraph para, LayoutElement el)
        {
            if (!para.Elements.Any()) return true;
            var last = para.Elements.Last();

            // Vertical gap > 1.5x font size usually means new paragraph
            float vGap = Math.Abs(last.Rect.GetY() - el.Rect.GetY());
            if (vGap > last.FontSize * 1.5f) return true;

            // If X coordinate jumps significantly back to the left
            if (el.Rect.GetX() < last.Rect.GetX() - 50) return true;

            return false;
        }

        private Wp.Paragraph CreateParagraph(LayoutParagraph layoutPara)
        {
            var para = new Wp.Paragraph();
            var paraProps = new Wp.ParagraphProperties();
            
            // Alignment detection
            float firstX = layoutPara.Elements.FirstOrDefault()?.Rect.GetX() ?? 0;
            if (firstX > 200) paraProps.Append(new Wp.Justification { Val = Wp.JustificationValues.Center });
            
            para.Append(paraProps);

            // Group elements by line for better run management
            var lines = layoutPara.Elements.GroupBy(e => Math.Round(e.Rect.GetY() / 2) * 2).OrderByDescending(g => g.Key);

            foreach (var line in lines)
            {
                foreach (var el in line.OrderBy(e => e.Rect.GetX()))
                {
                    var run = new Wp.Run();
                    var runProps = new Wp.RunProperties();
                    
                    if (el.IsBold) runProps.Append(new Wp.Bold());
                    if (el.IsItalic) runProps.Append(new Wp.Italic());
                    
                    runProps.Append(new Wp.FontSize { Val = (el.FontSize * 2).ToString() });
                    runProps.Append(new Wp.RunFonts { Ascii = "Calibri", HighAnsi = "Calibri" });

                    run.Append(runProps);
                    run.AppendChild(new Wp.Text(el.Text) { Space = SpaceProcessingModeValues.Preserve });
                    para.Append(run);
                }
                // Add a soft break if it's a multi-line paragraph
                if (line.Key != lines.Last().Key) para.Append(new Wp.Run(new Wp.Break()));
            }

            return para;
        }

        private void InsertImageIntoDocx(MainDocumentPart mainPart, Wp.Body body, ImageElement img)
        {
            try
            {
                var imagePart = mainPart.AddImagePart(img.Extension.ToLower() == "jpg" || img.Extension.ToLower() == "jpeg" ? ImagePartType.Jpeg : ImagePartType.Png);
                using (var stream = new MemoryStream(img.Bytes)) imagePart.FeedData(stream);

                var relationshipId = mainPart.GetIdOfPart(imagePart);
                
                // EMUs: 1 point = 12700 EMUs, 1 inch = 914400 EMUs
                // PDF points are 1/72 inch. So 1 PDF point = 12700 EMUs.
                long widthEmus = (long)(img.Rect.GetWidth() * 12700);
                long heightEmus = (long)(img.Rect.GetHeight() * 12700);

                var element = new Wp.Paragraph(
                    new Wp.Run(
                        new Wp.Drawing(
                            new DocumentFormat.OpenXml.Drawing.Wordprocessing.Inline(
                                new DocumentFormat.OpenXml.Drawing.Wordprocessing.Extent { Cx = widthEmus, Cy = heightEmus },
                                new DocumentFormat.OpenXml.Drawing.Wordprocessing.EffectExtent { LeftEdge = 0L, TopEdge = 0L, RightEdge = 0L, BottomEdge = 0L },
                                new DocumentFormat.OpenXml.Drawing.Wordprocessing.DocProperties { Id = (UInt32Value)1U, Name = "Picture" },
                                new DocumentFormat.OpenXml.Drawing.Wordprocessing.NonVisualGraphicFrameDrawingProperties(new DocumentFormat.OpenXml.Drawing.GraphicFrameLocks { NoChangeAspect = true }),
                                new DocumentFormat.OpenXml.Drawing.Graphic(
                                    new DocumentFormat.OpenXml.Drawing.GraphicData(
                                        new DocumentFormat.OpenXml.Drawing.Pictures.Picture(
                                            new DocumentFormat.OpenXml.Drawing.Pictures.NonVisualPictureProperties(
                                                new DocumentFormat.OpenXml.Drawing.Pictures.NonVisualDrawingProperties { Id = (UInt32Value)0U, Name = "Image" },
                                                new DocumentFormat.OpenXml.Drawing.Pictures.NonVisualPictureDrawingProperties()),
                                            new DocumentFormat.OpenXml.Drawing.Pictures.BlipFill(
                                                new DocumentFormat.OpenXml.Drawing.Blip { Embed = relationshipId, CompressionState = DocumentFormat.OpenXml.Drawing.BlipCompressionValues.Print },
                                                new DocumentFormat.OpenXml.Drawing.Stretch(new DocumentFormat.OpenXml.Drawing.FillRectangle())),
                                            new DocumentFormat.OpenXml.Drawing.Pictures.ShapeProperties(
                                                new DocumentFormat.OpenXml.Drawing.Transform2D(
                                                    new DocumentFormat.OpenXml.Drawing.Offset { X = 0L, Y = 0L },
                                                    new DocumentFormat.OpenXml.Drawing.Extents { Cx = widthEmus, Cy = heightEmus }),
                                                new DocumentFormat.OpenXml.Drawing.PresetGeometry { Preset = DocumentFormat.OpenXml.Drawing.ShapeTypeValues.Rectangle }))
                                    ) { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" })
                            ) { DistanceFromTop = 0U, DistanceFromBottom = 0U, DistanceFromLeft = 0U, DistanceFromRight = 0U }
                        )
                    )
                );
                body.Append(element);
            }
            catch (Exception ex) { _logger.LogWarning("Failed to insert image: {Msg}", ex.Message); }
        }

        private void SetupDocxStyles(MainDocumentPart mainPart)
        {
            // Optional: Add a StylesDefinitionsPart to define global fonts and sizes
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
            string? soffice = GetSofficePath();
            if (soffice == null)
            {
                _logger.LogError("[PDF SERVICE] LibreOffice not found. Cannot convert {File} to PDF.", Path.GetFileName(src));
                throw new InvalidOperationException(
                    $"LibreOffice (soffice) was not found on this system. " +
                    $"Install it with: apt-get install -y libreoffice-core libreoffice-writer fonts-dejavu");
            }

            var outDir = Path.GetDirectoryName(dst)!;
            var profileDir = Path.Combine(Path.GetTempPath(), $"libreoffice-profile-{Guid.NewGuid()}");
            Directory.CreateDirectory(profileDir);

            _logger.LogInformation("[PDF SERVICE] soffice={Soffice} outDir={OutDir} profile={Profile}", soffice, outDir, profileDir);

            // On Linux the profile path must start with file:/// (three slashes)
            var profileUri = OperatingSystem.IsWindows()
                ? $"file:///{profileDir.Replace("\\", "/")}"
                : $"file://{profileDir}";

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = soffice,
                    Arguments = $"-env:UserInstallation={profileUri} --headless --norestore --convert-to pdf \"{src}\" --outdir \"{outDir}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            try
            {
                process.Start();
                var stdout = process.StandardOutput.ReadToEnd();
                var stderr = process.StandardError.ReadToEnd();

                if (!process.WaitForExit(150000))
                {
                    process.Kill();
                    throw new TimeoutException("LibreOffice conversion timed out after 150 seconds.");
                }

                if (!string.IsNullOrWhiteSpace(stderr))
                    _logger.LogWarning("[PDF SERVICE] soffice stderr: {Stderr}", stderr);
                if (!string.IsNullOrWhiteSpace(stdout))
                    _logger.LogInformation("[PDF SERVICE] soffice stdout: {Stdout}", stdout);

                // LibreOffice writes <filename>.pdf in outDir — rename to our target path
                var generatedFile = Path.Combine(outDir, Path.GetFileNameWithoutExtension(src) + ".pdf");
                if (File.Exists(generatedFile) && generatedFile != dst)
                    File.Move(generatedFile, dst, overwrite: true);

                if (!File.Exists(dst) || new FileInfo(dst).Length == 0)
                    throw new InvalidOperationException($"LibreOffice ran but did not produce a valid PDF for: {Path.GetFileName(src)}");

                _logger.LogInformation("[PDF SERVICE] Office → PDF success: {Dst} ({Bytes} bytes)", dst, new FileInfo(dst).Length);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[PDF SERVICE] LibreOffice conversion failed for {File}", Path.GetFileName(src));
                throw;
            }
            finally
            {
                if (Directory.Exists(profileDir))
                    try { Directory.Delete(profileDir, true); } catch { }
            }
        }

        private string? GetSofficePath()
        {
            // ── Windows ──────────────────────────────────────────────────────────
            if (OperatingSystem.IsWindows())
            {
                var winPaths = new[]
                {
                    @"C:\Program Files\LibreOffice\program\soffice.exe",
                    @"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
                };
                var found = winPaths.FirstOrDefault(File.Exists);
                if (found != null)
                {
                    _logger.LogInformation("[STARTUP] LibreOffice found at: {Path}", found);
                    return found;
                }
                _logger.LogWarning("[STARTUP] LibreOffice NOT found on Windows. Office-to-PDF will fail.");
                return null;
            }

            // ── Linux / Docker ────────────────────────────────────────────────────
            var linuxPaths = new[]
            {
                "/usr/bin/soffice",
                "/usr/lib/libreoffice/program/soffice",
                "/usr/local/bin/soffice",
                "/opt/libreoffice/program/soffice",
                "/snap/bin/libreoffice",
            };

            foreach (var path in linuxPaths)
            {
                if (File.Exists(path))
                {
                    _logger.LogInformation("[STARTUP] LibreOffice found at: {Path}", path);
                    return path;
                }
            }

            // Last resort: rely on PATH (e.g. symlink created by package manager)
            _logger.LogWarning("[STARTUP] LibreOffice not found at known paths — falling back to PATH lookup 'soffice'");
            return "soffice";
        }

        private void ConvertOfficeToCsv(string src, string dst)
        {
            string? soffice = GetSofficePath();
            if (soffice != null)
            {
                var outDir = Path.GetDirectoryName(dst)!;
                var process = new Process { StartInfo = new ProcessStartInfo { FileName = soffice, Arguments = $"--headless --convert-to csv \"{src}\" --outdir \"{outDir}\"", UseShellExecute = false, CreateNoWindow = true } };
                process.Start();
                process.WaitForExit(60000);
                var outFile = Path.Combine(outDir, Path.GetFileNameWithoutExtension(src) + ".csv");
                if (File.Exists(outFile) && outFile != dst) File.Move(outFile, dst, true);
            }
        }

        private void ConvertOfficeToJson(string src, string dst) => File.WriteAllText(dst, "[]");

        private void ConvertCsvToXlsx(string src, string dst)
        {
            var lines = File.ReadAllLines(src);
            using var spreadsheet = SpreadsheetDocument.Create(dst, SpreadsheetDocumentType.Workbook);
            var workbookPart = spreadsheet.AddWorkbookPart();
            workbookPart.Workbook = new DocumentFormat.OpenXml.Spreadsheet.Workbook();
            var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            var sheetData = new DocumentFormat.OpenXml.Spreadsheet.SheetData();
            worksheetPart.Worksheet = new DocumentFormat.OpenXml.Spreadsheet.Worksheet(sheetData);
            var sheets = spreadsheet.WorkbookPart.Workbook.AppendChild(new DocumentFormat.OpenXml.Spreadsheet.Sheets());
            sheets.Append(new DocumentFormat.OpenXml.Spreadsheet.Sheet { Id = spreadsheet.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "Sheet1" });
            uint rowIdx = 1;
            foreach (var line in lines)
            {
                var row = new DocumentFormat.OpenXml.Spreadsheet.Row { RowIndex = rowIdx++ };
                foreach (var cell in line.Split(','))
                    row.Append(new DocumentFormat.OpenXml.Spreadsheet.Cell { DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String, CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(cell.Trim('"')) });
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

        private void ConvertHtmlToPdf(string src, string dst) { }
        private void ConvertHtmlToDocx(string src, string dst) { }
        private void CreateZip(string src, string dst) { }
        private void ExtractZip(string src, string dst) { }

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
        }
    }
}
