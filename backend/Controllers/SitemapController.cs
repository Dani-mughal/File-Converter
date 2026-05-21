using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Xml.Linq;
using ConvertHub.Api.Models;

namespace ConvertHub.Api.Controllers
{
    [ApiController]
    [Route("")]
    public class SitemapController : ControllerBase
    {
        private const string BaseUrl = "https://converterhub.tech";

        [HttpGet("sitemap.xml")]
        public async Task<IActionResult> GetSitemap()
        {
            var ns = XNamespace.Get("http://www.sitemaps.org/schemas/sitemap/0.9");
            var root = new XElement(ns + "urlset");

            // 1. Homepage
            root.Add(CreateUrlElement(ns, BaseUrl, 1.0, "daily"));

            // 2. Static Pages
            root.Add(CreateUrlElement(ns, $"{BaseUrl}/about", 0.7, "monthly"));
            root.Add(CreateUrlElement(ns, $"{BaseUrl}/contact", 0.7, "monthly"));
            root.Add(CreateUrlElement(ns, $"{BaseUrl}/privacy", 0.3, "monthly"));
            root.Add(CreateUrlElement(ns, $"{BaseUrl}/terms", 0.3, "monthly"));

            // 3. Dynamic Converter Pages
            var toolIds = GetConverterToolIds();
            foreach (var id in toolIds)
            {
                root.Add(CreateUrlElement(ns, $"{BaseUrl}/{id}", 0.8, "weekly"));
            }

            var doc = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), root);
            return Content(doc.ToString(), "application/xml", Encoding.UTF8);
        }

        [HttpGet("sitemap-index.xml")]
        public IActionResult GetSitemapIndex()
        {
            var ns = XNamespace.Get("http://www.sitemaps.org/schemas/sitemap/0.9");
            var root = new XElement(ns + "sitemapindex",
                new XElement(ns + "sitemap",
                    new XElement(ns + "loc", $"{BaseUrl}/sitemap.xml"),
                    new XElement(ns + "lastmod", DateTime.UtcNow.ToString("yyyy-MM-dd"))
                )
            );

            var doc = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), root);
            return Content(doc.ToString(), "application/xml", Encoding.UTF8);
        }

        [HttpGet("robots.txt")]
        public IActionResult GetRobotsTxt()
        {
            var sb = new StringBuilder();
            sb.AppendLine("User-agent: *");
            sb.AppendLine("Allow: /");
            sb.AppendLine("Disallow: /api/");
            sb.AppendLine("Disallow: /TempUploads/");
            sb.AppendLine("Disallow: /internal/");
            sb.AppendLine($"Sitemap: {BaseUrl}/sitemap.xml");
            
            return Content(sb.ToString(), "text/plain", Encoding.UTF8);
        }

        private XElement CreateUrlElement(XNamespace ns, string loc, double priority, string changeFreq)
        {
            return new XElement(ns + "url",
                new XElement(ns + "loc", loc),
                new XElement(ns + "lastmod", DateTime.UtcNow.ToString("yyyy-MM-dd")),
                new XElement(ns + "changefreq", changeFreq),
                new XElement(ns + "priority", priority.ToString("F1"))
            );
        }

        private List<string> GetConverterToolIds()
        {
            // This should match the IDs in frontend/src/config/toolsConfig.js
            return new List<string>
            {
                "pdf-to-docx", "pdf-to-xlsx", "pdf-to-jpg", "pdf-to-html", "docx-to-pdf", "xlsx-to-pdf", "pptx-to-pdf", "merge-pdf", "split-pdf", "compress-pdf-high", "compress-pdf-med", "compress-pdf-low", "image-to-pdf",
                "jpg-to-png", "png-to-jpg", "webp-to-png", "webp-to-jpg", "svg-to-png", "svg-to-jpg", "svg-to-pdf", "heic-to-jpg", "heic-to-png", "png-to-svg",
                "mp4-to-mp3", "video-to-gif", "mov-to-mp4", "mkv-to-mp4", "avi-to-mp4", "wav-to-mp3", "mp3-to-wav", "mp4-to-gif",
                "zip-folder", "zip-file", "unzip", "xlsx-to-csv", "csv-to-json", "json-to-csv", "xml-to-json", "json-to-xml", "markdown-to-html", "json-to-yaml"
            };
        }
    }
}
