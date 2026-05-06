import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  HiOutlineVideoCamera, 
  HiOutlinePhoto, 
  HiOutlineDocumentText, 
  HiOutlineGif, 
  HiOutlineSquares2X2,
  HiChevronRight,
  HiOutlineArchiveBox,
  HiOutlineBookOpen,
  HiOutlineCodeBracket,
  HiOutlineCube,
  HiOutlineWrenchScrewdriver
} from 'react-icons/hi2';

const CATEGORIES = [
  {
    id: 'all',
    title: 'All Tools',
    icon: HiOutlineSquares2X2,
  },
  {
    id: 'document',
    title: 'Documents',
    icon: HiOutlineDocumentText,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    links: [
      { label: 'PDF to Word', id: 'pdf-to-docx' },
      { label: 'PDF to Excel', id: 'pdf-to-xlsx' },
      { label: 'Word to PDF', id: 'docx-to-pdf' },
      { label: 'Excel to PDF', id: 'xlsx-to-pdf' },
      { label: 'PPT to PDF', id: 'pptx-to-pdf' },
      { label: 'PPT to JPG', id: 'ppt-to-jpg' },
      { label: 'PPT to PNG', id: 'ppt-to-png' },
      { label: 'PDF to JPG', id: 'pdf-to-jpg' },
      { label: 'TXT to PDF', id: 'txt-to-pdf' },
      { label: 'HTML to PDF', id: 'html-to-pdf' }
    ]
  },
  {
    id: 'image',
    title: 'Images & Design',
    icon: HiOutlinePhoto,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    links: [
      { label: 'JPG to PNG', id: 'jpg-to-png' },
      { label: 'PNG to JPG', id: 'png-to-jpg' },
      { label: 'SVG to PNG', id: 'svg-to-png' },
      { label: 'SVG to JPG', id: 'svg-to-jpg' },
      { label: 'SVG to PDF', id: 'svg-to-pdf' },
      { label: 'HEIC to JPG', id: 'heic-to-jpg' },
      { label: 'WEBP to PNG', id: 'webp-to-png' },
      { label: 'PSD to JPG', id: 'psd-to-jpg' },
      { label: 'AI to SVG', id: 'ai-to-svg' },
      { label: 'EPS to PDF', id: 'eps-to-pdf' }
    ]
  },
  {
    id: 'video',
    title: 'Video & Audio',
    icon: HiOutlineVideoCamera,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-500/10',
    links: [
      { label: 'MP4 to MP3', id: 'mp4-to-mp3' },
      { label: 'Video to GIF', id: 'video-to-gif' },
      { label: 'MOV to MP4', id: 'mov-to-mp4' },
      { label: 'AVI to MP4', id: 'avi-to-mp4' },
      { label: 'WAV to MP3', id: 'wav-to-mp3' },
      { label: 'MP3 to OGG', id: 'mp3-to-ogg' },
      { label: 'MKV to MP4', id: 'mkv-to-mp4' },
      { label: 'FLAC to MP3', id: 'flac-to-mp3' }
    ]
  },
  {
    id: 'archive',
    title: 'Archive & Ebooks',
    icon: HiOutlineArchiveBox,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-500/10',
    links: [
      { label: 'ZIP to RAR', id: 'zip-to-rar' },
      { label: 'RAR to ZIP', id: 'rar-to-zip' },
      { label: '7Z to ZIP', id: '7z-to-zip' },
      { label: 'EPUB to PDF', id: 'epub-to-pdf' },
      { label: 'MOBI to EPUB', id: 'mobi-to-epub' },
      { label: 'AZW3 to PDF', id: 'azw3-to-pdf' },
      { label: 'DJVU to PDF', id: 'djvu-to-pdf' },
      { label: 'TAR to GZ', id: 'tar-to-gz' }
    ]
  },
  {
    id: 'code',
    title: 'Code & Data',
    icon: HiOutlineCodeBracket,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    links: [
      { label: 'JSON to CSV', id: 'json-to-csv' },
      { label: 'CSV to JSON', id: 'csv-to-json' },
      { label: 'XML to JSON', id: 'xml-to-json' },
      { label: 'YAML to JSON', id: 'yaml-to-json' },
      { label: 'Markdown to HTML', id: 'markdown-to-html' },
      { label: 'SQL to CSV', id: 'sql-to-csv' },
      { label: 'JSON to YAML', id: 'json-to-yaml' },
      { label: 'CSV to SQL', id: 'csv-to-sql' }
    ]
  },
  {
    id: 'cad',
    title: 'CAD & 3D',
    icon: HiOutlineCube,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-500/10',
    links: [
      { label: 'STL to OBJ', id: 'stl-to-obj' },
      { label: 'OBJ to GLTF', id: 'obj-to-gltf' },
      { label: 'DWG to DXF', id: 'dwg-to-dxf' },
      { label: 'DXF to SVG', id: 'dxf-to-svg' },
      { label: 'STL to FBX', id: 'stl-to-fbx' },
      { label: 'GLB to GLTF', id: 'glb-to-gltf' },
      { label: 'STEP to IGES', id: 'step-to-iges' },
      { label: 'OBJ to STL', id: 'obj-to-stl' }
    ]
  }
];

export default function ConversionGrid({ externalSearch = '' }) {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [internalSearch, setInternalSearch] = useState('');

  // Use external search if provided (from hero), otherwise internal
  const searchQuery = externalSearch || internalSearch;

  const filteredCategories = useMemo(() => {
    let result = activeTab === 'all' 
      ? CATEGORIES.filter(c => c.id !== 'all') 
      : CATEGORIES.filter(c => c.id === activeTab);

    if (searchQuery) {
      result = result.map(cat => ({
        ...cat,
        links: cat.links?.filter(l => 
          l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.links && cat.links.length > 0);
    }

    return result;
  }, [activeTab, searchQuery]);

  return (
    <section id="conversions" className={`py-24 relative overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            Universal File Conversion
          </motion.h2>
          
          {/* Tabs / Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  activeTab === cat.id
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20'
                    : darkMode 
                      ? 'bg-slate-900 text-slate-400 border border-white/5 hover:bg-slate-800' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <cat.icon className="w-5 h-5" />
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`group flex flex-col rounded-[2rem] p-8 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-slate-900/60 border border-slate-800/50 backdrop-blur-sm shadow-xl shadow-black/20' 
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-8 pb-5 border-b border-slate-200/50 dark:border-slate-800/50">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${cat.bg} ${cat.color}`}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {cat.title}
                  </h3>
                </div>

                <ul className="space-y-4 flex-1">
                  {cat.links.map((link) => (
                    <li key={link.id}>
                      <Link 
                        to={`/convert?type=${link.id}`} 
                        className={`group/link flex items-center justify-between text-[15px] font-semibold transition-colors ${
                          darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <span>{link.label}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all ${darkMode ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                           <HiChevronRight className="w-4 h-4 text-primary-500" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-500">No conversion tools found for your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
