import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineDocumentText,
  HiOutlineTableCells,
  HiOutlinePhoto,
  HiOutlinePresentationChartBar,
  HiOutlineArchiveBox,
  HiOutlineVideoCamera,
  HiOutlineGif,
  HiOutlineSparkles
} from 'react-icons/hi2';

const SUPPORTED_CONVERSIONS = {
  // Documents
  'pdf': ['docx', 'txt', 'html', 'jpg', 'png', 'epub'],
  'docx': ['pdf', 'txt', 'html', 'odt', 'rtf'],
  'doc': ['pdf', 'docx'],
  'txt': ['pdf', 'docx'],
  'rtf': ['docx', 'pdf'],
  'odt': ['pdf', 'docx'],
  'epub': ['pdf'],
  'html': ['pdf', 'txt'],
  
  // Spreadsheets
  'xlsx': ['csv', 'pdf', 'xls', 'html'],
  'xls': ['xlsx', 'pdf'],
  'csv': ['xlsx', 'json', 'pdf'],
  'ods': ['xlsx'],
  
  // Presentations
  'pptx': ['pdf', 'jpg', 'png'],
  'ppt': ['pptx', 'pdf'],
  
  // Images
  'jpg': ['png', 'webp', 'pdf'],
  'jpeg': ['png', 'webp', 'pdf'],
  'png': ['jpg', 'webp', 'pdf', 'svg'],
  'webp': ['jpg', 'png'],
  'bmp': ['png', 'jpg'],
  'svg': ['png', 'jpg'],
  
  // Media
  'mp4': ['avi', 'mov', 'gif', 'mp3'],
  'avi': ['mp4', 'mov', 'gif'],
  'mov': ['mp4', 'avi', 'gif'],
  'mkv': ['mp4'],
  'webm': ['mp4'],
  'mp3': ['wav', 'aac', 'm4a'],
  'wav': ['mp3', 'flac'],
  'aac': ['mp3'],
  'm4a': ['mp3'],
  'gif': ['mp4', 'png', 'jpg'],

  // Code/Data
  'json': ['csv', 'xml'],
  'xml': ['json'],
  'md': ['html', 'pdf']
};

const FORMAT_METADATA = {
  'pdf': { label: 'PDF', icon: HiOutlineDocumentText, gradient: 'from-red-500 to-rose-600' },
  'docx': { label: 'DOCX', icon: HiOutlineDocumentText, gradient: 'from-blue-500 to-indigo-600' },
  'txt': { label: 'TXT', icon: HiOutlineDocumentText, gradient: 'from-slate-500 to-gray-600' },
  'html': { label: 'HTML', icon: HiOutlineDocumentText, gradient: 'from-orange-500 to-amber-600' },
  'jpg': { label: 'JPG', icon: HiOutlinePhoto, gradient: 'from-pink-500 to-rose-600' },
  'png': { label: 'PNG', icon: HiOutlinePhoto, gradient: 'from-emerald-500 to-teal-600' },
  'epub': { label: 'EPUB', icon: HiOutlineDocumentText, gradient: 'from-purple-500 to-indigo-600' },
  'xlsx': { label: 'XLSX', icon: HiOutlineTableCells, gradient: 'from-green-500 to-emerald-600' },
  'csv': { label: 'CSV', icon: HiOutlineTableCells, gradient: 'from-teal-500 to-cyan-600' },
  'json': { label: 'JSON', icon: HiOutlineSparkles, gradient: 'from-amber-500 to-orange-600' },
  'mp3': { label: 'MP3', icon: HiOutlineVideoCamera, gradient: 'from-rose-500 to-red-600' },
  'mp4': { label: 'MP4', icon: HiOutlineVideoCamera, gradient: 'from-indigo-500 to-blue-600' },
  'gif': { label: 'GIF', icon: HiOutlineGif, gradient: 'from-fuchsia-500 to-purple-600' },
  'zip': { label: 'ZIP', icon: HiOutlineArchiveBox, gradient: 'from-slate-700 to-slate-900' },
  'unzip': { label: 'Unzip', icon: HiOutlineArchiveBox, gradient: 'from-zinc-700 to-zinc-900' },
  'rtf': { label: 'RTF', icon: HiOutlineDocumentText, gradient: 'from-slate-400 to-slate-600' },
  'odt': { label: 'ODT', icon: HiOutlineDocumentText, gradient: 'from-blue-400 to-blue-600' },
  'avi': { label: 'AVI', icon: HiOutlineVideoCamera, gradient: 'from-red-400 to-red-600' },
  'mov': { label: 'MOV', icon: HiOutlineVideoCamera, gradient: 'from-gray-500 to-gray-700' },
  'svg': { label: 'SVG', icon: HiOutlinePhoto, gradient: 'from-orange-400 to-orange-600' },
  'webp': { label: 'WEBP', icon: HiOutlinePhoto, gradient: 'from-cyan-400 to-cyan-600' },
  'xml': { label: 'XML', icon: HiOutlineSparkles, gradient: 'from-amber-400 to-amber-600' },
};

export default function ConversionSelector({ selected, onSelect, files = [] }) {
  const { darkMode } = useTheme();

  const options = useMemo(() => {
    if (files.length === 0) return [];

    if (files.length > 1) {
      return [{ id: 'zip', label: 'Create ZIP Archive', description: 'Compress all files into one ZIP', ...FORMAT_METADATA['zip'] }];
    }

    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (ext === 'zip') {
      return [{ id: 'unzip', label: 'Extract ZIP', description: 'Unpack archive contents', ...FORMAT_METADATA['unzip'] }];
    }

    const targets = SUPPORTED_CONVERSIONS[ext] || [];
    return targets.map(t => ({
      id: t,
      label: `To ${t.toUpperCase()}`,
      description: `Convert to ${t.toUpperCase()} format`,
      ...(FORMAT_METADATA[t] || { label: t.toUpperCase(), icon: HiOutlineSparkles, gradient: 'from-primary-500 to-primary-600' })
    }));
  }, [files]);

  if (files.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Select Target Format
        </h3>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
          {files.length > 1 ? 'Multiple Files' : `Input: ${files[0].name.split('.').pop()?.toUpperCase()}`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.length > 0 ? (
          options.map((opt, index) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.id;

            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(opt.id)}
                className={`relative group p-4 rounded-xl text-left transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? darkMode
                      ? 'bg-gradient-to-br ' + opt.gradient + ' border-transparent shadow-xl ring-2 ring-white/20'
                      : 'bg-gradient-to-br ' + opt.gradient + ' border-transparent shadow-xl ring-2 ring-white/50'
                    : darkMode
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : darkMode
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className={`font-bold text-sm truncate ${isSelected ? 'text-white' : darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {opt.label}
                    </p>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-white/70' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {opt.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-indigo-500"
                  >
                    <svg className="w-2.5 h-2.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })
        ) : (
          <div className={`col-span-full p-8 text-center rounded-xl border-2 border-dashed ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            No direct conversions available for this format yet.
          </div>
        )}
      </div>
    </div>
  );
}
