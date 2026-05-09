import fs from 'fs';
import path from 'path';

// Manual tool list (or import from seoConfig if possible in Node)
const tools = [
  'pdf-to-docx', 'docx-to-pdf', 'jpg-to-pdf', 'pdf-to-jpg',
  'merge-pdf', 'compress-pdf', 'split-pdf', 'jpg-to-png',
  'png-to-jpg', 'svg-to-png', 'heic-to-jpg', 'webp-to-jpg',
  'video-to-gif', 'mp4-to-mp3', 'epub-to-pdf', 'json-to-csv'
];

const BASE_URL = 'https://converthub.com'; // Replace with actual domain

const generateSitemap = () => {
  const urls = [
    { loc: '/', priority: '1.0' },
    { loc: '/about', priority: '0.8' },
    { loc: '/contact', priority: '0.8' },
    ...tools.map(tool => ({ loc: `/${tool}`, priority: '0.9' }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ Sitemap generated at ${outputPath}`);
};

generateSitemap();
