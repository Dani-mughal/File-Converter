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
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-500/10',
    border: 'group-hover:border-rose-200 dark:group-hover:border-rose-500/30',
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
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    border: 'group-hover:border-blue-200 dark:group-hover:border-blue-500/30',
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
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    border: 'group-hover:border-amber-200 dark:group-hover:border-amber-500/30',
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
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    border: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30',
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
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-500/10',
    border: 'group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30',
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export default function ConversionGrid() {
  const { darkMode } = useTheme();

  return (
    <section id="conversions" className={`py-24 relative overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[100px] ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/40'}`} />
        <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-[100px] ${darkMode ? 'bg-sky-900/20' : 'bg-sky-200/40'}`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            Universal File Conversion
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            A professional suite of conversion tools. Fast, secure, and entirely online with no software installation required.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`group flex flex-col rounded-2xl p-6 transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-900/60 border border-slate-800/50 backdrop-blur-sm shadow-xl shadow-black/20' 
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-lg'
              } ${cat.border}`}
            >
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${cat.bg} ${cat.color}`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className={`font-semibold text-sm tracking-wide ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {cat.title}
                </h3>
              </div>

              <ul className="space-y-3 flex-1">
                {cat.links.map((link) => (
                  <li key={link.id}>
                    <Link 
                      to={`/convert?type=${link.id}`} 
                      className={`group/link flex items-center justify-between text-[13px] font-medium transition-colors ${
                        darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <span>{link.label}</span>
                      <HiChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-indigo-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
