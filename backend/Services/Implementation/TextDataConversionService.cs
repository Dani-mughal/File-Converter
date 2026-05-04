using ConvertHub.Api.Models;
using CsvHelper;
using Newtonsoft.Json;
using Markdig;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;
using System;
using System.Xml;
using System.Collections.Generic;
using System.Globalization;

using ConvertHub.Api.Services.Interfaces;

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
            var ext = GetTempExtension(conversionType);
            var outputPath = Path.Combine(_storageService.GetTempDirectory(), $"{Guid.NewGuid()}{ext}");
            await ConvertTextDataAsync(sourceFilePath, outputPath, conversionType);
            return outputPath;
        }

        public string GetOutputMimeType(ConversionType type)
        {
            return type switch
            {
                ConversionType.JsonToCsv => "text/csv",
                ConversionType.XmlToJson => "application/json",
                ConversionType.MarkdownToHtml => "text/html",
                ConversionType.CssMin => "text/css",
                ConversionType.JsBeautify => "application/javascript",
                _ => "text/plain"
            };
        }

        public string GetOutputFileName(string originalFileName, ConversionType type)
        {
            return $"{Path.GetFileNameWithoutExtension(originalFileName)}{GetTempExtension(type)}";
        }

        public ConversionType ParseConversionType(string typeStr) => ConversionType.Unknown;

        private string GetTempExtension(ConversionType type)
        {
            return type switch
            {
                ConversionType.JsonToCsv => ".csv",
                ConversionType.XmlToJson => ".json",
                ConversionType.MarkdownToHtml => ".html",
                ConversionType.CssMin => ".css",
                ConversionType.JsBeautify => ".js",
                _ => ".txt"
            };
        }

        public async Task ConvertTextDataAsync(string sourcePath, string destPath, ConversionType conversionType)
        {
            await Task.Run(() =>
            {
                try
                {
                    switch (conversionType)
                    {
                        case ConversionType.JsonToCsv:
                            var json = File.ReadAllText(sourcePath);
                            var objList = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);
                            if (objList != null && objList.Count > 0)
                            {
                                using var writer = new StreamWriter(destPath);
                                using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
                                
                                // Write headers
                                foreach (var key in objList[0].Keys)
                                {
                                    csv.WriteField(key);
                                }
                                csv.NextRecord();

                                // Write values
                                foreach (var obj in objList)
                                {
                                    foreach (var val in obj.Values)
                                    {
                                        csv.WriteField(val?.ToString());
                                    }
                                    csv.NextRecord();
                                }
                            }
                            break;

                        case ConversionType.XmlToJson:
                            var xmlDocument = new XmlDocument();
                            xmlDocument.Load(sourcePath);
                            var convertedJson = JsonConvert.SerializeXmlNode(xmlDocument);
                            File.WriteAllText(destPath, convertedJson);
                            break;

                        case ConversionType.MarkdownToHtml:
                            var md = File.ReadAllText(sourcePath);
                            var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
                            var html = Markdown.ToHtml(md, pipeline);
                            // Basic HTML wrapper
                            var fullHtml = $"<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head><body>{html}</body></html>";
                            File.WriteAllText(destPath, fullHtml);
                            break;

                        case ConversionType.CssMin:
                            var css = File.ReadAllText(sourcePath);
                            // Basic minification: remove newlines and extra spaces
                            var minCss = System.Text.RegularExpressions.Regex.Replace(css, @"\s+", " ");
                            minCss = System.Text.RegularExpressions.Regex.Replace(minCss, @"\s*([{}:;,])\s*", "$1");
                            File.WriteAllText(destPath, minCss);
                            break;

                        case ConversionType.JsBeautify:
                            // Full JS beautification is complex in pure C# without a library, but basic formatting:
                            // We just echo for now since we don't have a dedicated JS beautifier package installed
                            var js = File.ReadAllText(sourcePath);
                            // Placeholder implementation
                            var prettyJs = js.Replace(";", ";\n").Replace("{", "{\n").Replace("}", "\n}");
                            File.WriteAllText(destPath, prettyJs);
                            break;

                        default:
                            throw new NotSupportedException($"Text/Data conversion type {conversionType} is not fully supported yet.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error converting text/data for {conversionType}");
                    throw new InvalidOperationException($"Failed to convert text/data.", ex);
                }
            });
        }
    }
}
