import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  HiOutlineVideoCamera, 
  HiOutlinePhoto, 
  HiOutlineDocumentText, 
  HiOutlineGif, 
  HiOutlineSquares2X2,
  HiChevronRight
} from 'react-icons/hi2';

const CATEGORIES = [
  {
    title: 'Video & Audio',
    icon: HiOutlineVideoCamera,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    links: [
      { label: 'Video Converter', id: 'video' },
      { label: 'Audio Converter', id: 'audio' },
      { label: 'MP3 Converter', id: 'mp3' },
      { label: 'MP4 to MP3', id: 'mp4-to-mp3' },
      { label: 'Video to MP3', id: 'video-to-mp3' },
      { label: 'MP4 Converter', id: 'mp4' },
      { label: 'MOV to MP4', id: 'mov-to-mp4' },
      { label: 'MP3 to OGG', id: 'mp3-to-ogg' }
    ]
  },
  {
    title: 'Image',
    icon: HiOutlinePhoto,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    links: [
      { label: 'Image Converter', id: 'image' },
      { label: 'WEBP to PNG', id: 'webp-to-png' },
      { label: 'JFIF to PNG', id: 'jfif-to-png' },
      { label: 'PNG to SVG', id: 'png-to-svg' },
      { label: 'HEIC to JPG', id: 'heic-to-jpg' },
      { label: 'HEIC to PNG', id: 'heic-to-png' },
      { label: 'WEBP to JPG', id: 'webp-to-jpg' },
      { label: 'SVG Converter', id: 'svg' }
    ]
  },
  {
    title: 'PDF & Documents',
    icon: HiOutlineDocumentText,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    links: [
      { label: 'PDF Converter', id: 'pdf' },
      { label: 'Document Converter', id: 'document' },
      { label: 'Ebook Converter', id: 'ebook' },
      { label: 'PDF to Word', id: 'pdf-to-word' },
      { label: 'PDF to JPG', id: 'pdf-to-jpg' },
      { label: 'PDF to EPUB', id: 'pdf-to-epub' },
      { label: 'EPUB to PDF', id: 'epub-to-pdf' },
      { label: 'HEIC to PDF', id: 'heic-to-pdf' }
    ]
  },
  {
    title: 'GIF',
    icon: HiOutlineGif,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    links: [
      { label: 'Video to GIF', id: 'video-to-gif' },
      { label: 'MP4 to GIF', id: 'mp4-to-gif' },
      { label: 'WEBM to GIF', id: 'webm-to-gif' },
      { label: 'APNG to GIF', id: 'apng-to-gif' },
      { label: 'GIF to MP4', id: 'gif-to-mp4' },
      { label: 'GIF to APNG', id: 'gif-to-apng' },
      { label: 'Image to GIF', id: 'image-to-gif' },
      { label: 'MOV to GIF', id: 'mov-to-gif' }
    ]
  },
  {
    title: 'Others',
    icon: HiOutlineSquares2X2,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    links: [
      { label: 'Unit Converter', id: 'unit' },
      { label: 'Time Converter', id: 'time' },
      { label: 'Archive Converter', id: 'archive' },
      { label: 'JSON to CSV', id: 'json-to-csv' },
      { label: 'XML to JSON', id: 'xml-to-json' },
      { label: 'Markdown to HTML', id: 'markdown-to-html' },
      { label: 'CSS Minifier', id: 'css-min' },
      { label: 'JS Beautifier', id: 'js-beautify' }
    ]
  }
];

export default function ConversionGrid() {
  const { darkMode } = useTheme();

  return (
    <section id="conversions" className={`py-24 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-4xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            All Conversion Tools
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Explore our comprehensive suite of online file converters. No installation required, completely free, and secure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex flex-col rounded-3xl p-6 transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-900/40 border border-slate-800 hover:border-slate-700' 
                  : 'bg-slate-50 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bg} ${cat.color}`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className={`font-bold text-sm uppercase tracking-wider ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  {cat.title}
                </h3>
              </div>

              <ul className="space-y-3">
                {cat.links.map((link) => (
                  <li key={link.id}>
                    <Link 
                      to={`/convert?type=${link.id}`} 
                      className={`group flex items-center justify-between text-[13px] transition-colors ${
                        darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <span>{link.label}</span>
                      <HiChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
