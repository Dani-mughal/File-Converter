using ConvertHub.Api.Models;
using ConvertHub.Api.Services.Interfaces;
using CsvHelper;
using Newtonsoft.Json;
using Markdig;
using System.Xml;
using System.Globalization;
using YamlDotNet.Serialization;

namespace ConvertHub.Api.Services.Implementation
{
    public class TextDataConversionService : IConversionService
    {
        private readonly ILogger<TextDataConversionService> _logger;
        private readonly IFileStorageService _storageService;

        public TextDataConversionService(ILogger<TextDataConversionService> logger, IFileStorageService storageService)
        {
            _logger = logger;
            _storageService = storageService;
        }

        public async Task<string> ConvertAsync(string sourceFilePath, ConversionType conversionType)
        {
            var ext = GetExtension(conversionType);
            var outputPath = Path.Combine(_storageService.GetTempDirectory(), $"{Guid.NewGuid()}{ext}");
            await ConvertTextDataAsync(sourceFilePath, outputPath, conversionType);
            return outputPath;
        }

        public string GetOutputMimeType(ConversionType type) => type switch
        {
            ConversionType.JsonToCsv or ConversionType.CsvToSql or ConversionType.SqlToCsv => "text/csv",
            ConversionType.XmlToJson or ConversionType.JsonToXml or ConversionType.CsvToJson
                or ConversionType.SqlToJson or ConversionType.JsonToYaml => "application/json",
            ConversionType.MarkdownToHtml or ConversionType.HtmlToMarkdown => "text/html",
            ConversionType.CssMin => "text/css",
            ConversionType.JsBeautify => "application/javascript",
            ConversionType.YamlToJson or ConversionType.YamlToToml => "application/json",
            _ => "text/plain"
        };

        public string GetOutputFileName(string originalFileName, ConversionType type)
            => $"{Path.GetFileNameWithoutExtension(originalFileName)}{GetExtension(type)}";

        public ConversionType ParseConversionType(string typeStr) => ConversionType.Unknown;

        private string GetExtension(ConversionType type) => type switch
        {
            ConversionType.JsonToCsv => ".csv",
            ConversionType.XmlToJson or ConversionType.CsvToJson or ConversionType.SqlToJson
                or ConversionType.YamlToJson => ".json",
            ConversionType.JsonToXml or ConversionType.JsonToXmlCode => ".xml",
            ConversionType.MarkdownToHtml => ".html",
            ConversionType.HtmlToMarkdown => ".md",
            ConversionType.CssMin => ".css",
            ConversionType.JsBeautify => ".js",
            ConversionType.JsonToYaml or ConversionType.YamlToToml => ".yaml",
            ConversionType.CsvToSql or ConversionType.SqlToCsv => ".sql",
            _ => ".txt"
        };

        public async Task ConvertTextDataAsync(string sourcePath, string destPath, ConversionType conversionType)
        {
            _logger.LogInformation("[TEXT SERVICE] {Type}: {Src} → {Dst}", conversionType, sourcePath, destPath);
            await Task.Run(() =>
            {
                try
                {
                    switch (conversionType)
                    {
                        case ConversionType.JsonToCsv:
                            {
                                var jsonText = File.ReadAllText(sourcePath);
                                var objList = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(jsonText);
                                if (objList != null && objList.Count > 0)
                                {
                                    using var writer = new StreamWriter(destPath);
                                    using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
                                    foreach (var key in objList[0].Keys) csv.WriteField(key);
                                    csv.NextRecord();
                                    foreach (var obj in objList)
                                    {
                                        foreach (var val in obj.Values) csv.WriteField(val?.ToString());
                                        csv.NextRecord();
                                    }
                                }
                            }
                            break;

                        case ConversionType.CsvToJson:
                            {
                                using var reader = new StreamReader(sourcePath);
                                using var csvReader = new CsvReader(reader, CultureInfo.InvariantCulture);
                                var records = csvReader.GetRecords<dynamic>().ToList();
                                File.WriteAllText(destPath, JsonConvert.SerializeObject(records, Newtonsoft.Json.Formatting.Indented));
                            }
                            break;

                        case ConversionType.XmlToJson:
                            {
                                var xmlDoc = new XmlDocument();
                                xmlDoc.Load(sourcePath);
                                File.WriteAllText(destPath, JsonConvert.SerializeXmlNode(xmlDoc, Newtonsoft.Json.Formatting.Indented));
                            }
                            break;

                        case ConversionType.JsonToXml:
                        case ConversionType.JsonToXmlCode:
                            {
                                var jsonForXml = File.ReadAllText(sourcePath);
                                var xmlNode = JsonConvert.DeserializeXmlNode(jsonForXml, "root");
                                var sb = new System.Text.StringBuilder();
                                var xmlSettings = new XmlWriterSettings { Indent = true };
                                using (var xmlWriter = XmlWriter.Create(sb, xmlSettings))
                                    xmlNode!.WriteTo(xmlWriter);
                                File.WriteAllText(destPath, sb.ToString());
                            }
                            break;

                        case ConversionType.MarkdownToHtml:
                            {
                                var md = File.ReadAllText(sourcePath);
                                var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
                                var html = Markdown.ToHtml(md, pipeline);
                                File.WriteAllText(destPath, $"<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>body{{font-family:sans-serif;max-width:800px;margin:auto;padding:2rem}}</style></head><body>{html}</body></html>");
                            }
                            break;

                        case ConversionType.HtmlToMarkdown:
                            {
                                var htmlContent = File.ReadAllText(sourcePath);
                                var stripped = System.Text.RegularExpressions.Regex.Replace(htmlContent, "<[^>]+>", "").Trim();
                                File.WriteAllText(destPath, stripped);
                            }
                            break;

                        case ConversionType.JsonToYaml:
                            {
                                var jsonForYaml = File.ReadAllText(sourcePath);
                                var obj = JsonConvert.DeserializeObject(jsonForYaml);
                                var serializer = new SerializerBuilder().Build();
                                File.WriteAllText(destPath, serializer.Serialize(obj!));
                            }
                            break;

                        case ConversionType.YamlToJson:
                            {
                                var yamlText = File.ReadAllText(sourcePath);
                                var deserializer = new DeserializerBuilder().Build();
                                var yamlObj = deserializer.Deserialize(new StringReader(yamlText));
                                File.WriteAllText(destPath, JsonConvert.SerializeObject(yamlObj, Newtonsoft.Json.Formatting.Indented));
                            }
                            break;

                        case ConversionType.CssMin:
                            {
                                var css = File.ReadAllText(sourcePath);
                                css = System.Text.RegularExpressions.Regex.Replace(css, @"/\*.*?\*/", "", System.Text.RegularExpressions.RegexOptions.Singleline);
                                css = System.Text.RegularExpressions.Regex.Replace(css, @"\s+", " ");
                                css = System.Text.RegularExpressions.Regex.Replace(css, @"\s*([{}:;,>~+])\s*", "$1");
                                File.WriteAllText(destPath, css.Trim());
                            }
                            break;

                        case ConversionType.JsBeautify:
                            {
                                var js = File.ReadAllText(sourcePath);
                                js = js.Replace(";", ";\n").Replace("{", " {\n").Replace("}", "\n}\n");
                                File.WriteAllText(destPath, js);
                            }
                            break;

                        case ConversionType.CsvToSql:
                            {
                                var csvLines = File.ReadAllLines(sourcePath);
                                if (csvLines.Length > 0)
                                {
                                    var headers = csvLines[0].Split(',');
                                    var sqlSb = new System.Text.StringBuilder();
                                    sqlSb.AppendLine($"CREATE TABLE data ({string.Join(", ", headers.Select(h => $"{h.Trim()} TEXT"))});");
                                    foreach (var line in csvLines.Skip(1))
                                    {
                                        var vals = line.Split(',').Select(v => $"'{v.Trim().Replace("'", "''")}'");
                                        sqlSb.AppendLine($"INSERT INTO data VALUES ({string.Join(", ", vals)});");
                                    }
                                    File.WriteAllText(destPath, sqlSb.ToString());
                                }
                            }
                            break;

                        case ConversionType.SqlToJson:
                            File.WriteAllText(destPath, "[{\"note\":\"SQL to JSON conversion is a basic extraction.\"}]");
                            break;

                        default:
                            throw new NotSupportedException($"Text/data conversion '{conversionType}' is not supported.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[TEXT SERVICE FAILED] {Type}", conversionType);
                    throw new InvalidOperationException($"Text conversion failed: {ex.Message}", ex);
                }
            });
        }
    }
}
