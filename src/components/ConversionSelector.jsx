import { useState } from 'react';
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
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from 'react-icons/hi2';

const ALL_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'image/jpeg',
  'image/png'
];

const CONVERSION_OPTIONS = [
  // --- Popular / Essential ---
  {
    id: 'pdf-to-word',
    label: 'PDF → Word',
    description: 'Convert PDF to DOCX',
    category: 'Document',
    icon: HiOutlineDocumentText,
    acceptedTypes: ['application/pdf'],
    gradient: 'from-blue-500 to-indigo-600',
    shadowColor: 'shadow-blue-500/20',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-500/10',
    textLight: 'text-blue-600',
    textDark: 'text-blue-400',
  },
  {
    id: 'pdf-to-excel',
    label: 'PDF → Excel',
    description: 'Extract PDF to XLSX',
    category: 'Analysis',
    icon: HiOutlineTableCells,
    acceptedTypes: ['application/pdf'],
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/20',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-500/10',
    textLight: 'text-emerald-600',
    textDark: 'text-emerald-400',
  },
  {
    id: 'word-to-pdf',
    label: 'Word → PDF',
    description: 'Convert DOC/DOCX to PDF',
    category: 'Document',
    icon: HiOutlineDocumentText,
    acceptedTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    gradient: 'from-purple-500 to-pink-600',
    shadowColor: 'shadow-purple-500/20',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-500/10',
    textLight: 'text-purple-600',
    textDark: 'text-purple-400',
  },
  {
    id: 'image-to-pdf',
    label: 'Image → PDF',
    description: 'Convert JPG/PNG to PDF',
    category: 'Graphic',
    icon: HiOutlinePhoto,
    acceptedTypes: ['image/jpeg', 'image/png'],
    gradient: 'from-cyan-500 to-blue-600',
    shadowColor: 'shadow-cyan-500/20',
    bgLight: 'bg-cyan-50',
    bgDark: 'bg-cyan-500/10',
    textLight: 'text-cyan-600',
    textDark: 'text-cyan-400',
  },

  // --- Extended Section (Hidden by Default or for "More") ---
  {
    id: 'ppt-to-pdf',
    label: 'PPT → PDF',
    description: 'Convert Slides to PDF',
    category: 'Document',
    icon: HiOutlinePresentationChartBar,
    acceptedTypes: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    gradient: 'from-orange-500 to-red-600',
    shadowColor: 'shadow-orange-500/20',
    bgLight: 'bg-orange-50',
    bgDark: 'bg-orange-500/10',
    textLight: 'text-orange-600',
    textDark: 'text-orange-400',
  },
  {
    id: 'excel-to-pdf',
    label: 'Excel → PDF',
    description: 'Convert Spreadsheets',
    category: 'Analysis',
    icon: HiOutlineTableCells,
    acceptedTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    gradient: 'from-green-500 to-emerald-600',
    shadowColor: 'shadow-green-500/20',
    bgLight: 'bg-green-50',
    bgDark: 'bg-green-500/10',
    textLight: 'text-green-600',
    textDark: 'text-green-400',
  },
  {
    id: 'video-to-mp3',
    label: 'Video → MP3',
    description: 'Extract high quality audio',
    category: 'Media',
    icon: HiOutlineVideoCamera,
    acceptedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    gradient: 'from-rose-500 to-red-600',
    shadowColor: 'shadow-rose-500/20',
    bgLight: 'bg-rose-50',
    bgDark: 'bg-rose-500/10',
    textLight: 'text-rose-600',
    textDark: 'text-rose-400',
  },
  {
    id: 'mp4-to-gif',
    label: 'Video → GIF',
    description: 'Convert MP4 to animation',
    category: 'Media',
    icon: HiOutlineGif,
    acceptedTypes: ['video/mp4'],
    gradient: 'from-indigo-500 to-purple-600',
    shadowColor: 'shadow-indigo-500/20',
    bgLight: 'bg-indigo-50',
    bgDark: 'bg-indigo-500/10',
    textLight: 'text-indigo-600',
    textDark: 'text-indigo-400',
  },
  {
    id: 'pdf-to-csv',
    label: 'PDF → CSV',
    description: 'Extract PDF to CSV',
    category: 'Analysis',
    icon: HiOutlineTableCells,
    acceptedTypes: ['application/pdf'],
    gradient: 'from-lime-500 to-green-600',
    shadowColor: 'shadow-lime-500/20',
    bgLight: 'bg-lime-50',
    bgDark: 'bg-lime-500/10',
    textLight: 'text-lime-600',
    textDark: 'text-lime-400',
  },
  {
    id: 'zip',
    label: 'Zip Archive',
    description: 'Compress and archive',
    category: 'System',
    icon: HiOutlineArchiveBox,
    acceptedTypes: ALL_MIME_TYPES,
    gradient: 'from-slate-500 to-gray-600',
    shadowColor: 'shadow-slate-500/20',
    bgLight: 'bg-slate-100',
    bgDark: 'bg-slate-500/20',
    textLight: 'text-slate-600',
    textDark: 'text-slate-400',
  },
  {
    id: 'unzip',
    label: 'Unzip',
    description: 'Extract Zip Archive',
    category: 'System',
    icon: HiOutlineArchiveBox,
    acceptedTypes: ['application/zip', 'application/x-zip-compressed'],
    gradient: 'from-gray-600 to-zinc-700',
    shadowColor: 'shadow-gray-500/20',
    bgLight: 'bg-gray-100',
    bgDark: 'bg-gray-600/20',
    textLight: 'text-gray-700',
    textDark: 'text-gray-300',
  },
  {
    id: 'png-to-svg',
    label: 'PNG → SVG',
    description: 'Vectorize raster images',
    category: 'Graphic',
    icon: HiOutlinePhoto,
    acceptedTypes: ['image/png'],
    gradient: 'from-violet-500 to-fuchsia-600',
    shadowColor: 'shadow-violet-500/20',
    bgLight: 'bg-violet-50',
    bgDark: 'bg-violet-500/10',
    textLight: 'text-violet-600',
    textDark: 'text-violet-400',
  }
];

export default function ConversionSelector({ selected, onSelect, fileType }) {
  const { darkMode } = useTheme();
  const [showMore, setShowMore] = useState(false);

  // Popular items are the first 4
  const popularOptions = CONVERSION_OPTIONS.slice(0, 4);
  const remainingOptions = CONVERSION_OPTIONS.slice(4);

  const isOptionDisabled = (option) => {
    if (!fileType) return false;
    return !option.acceptedTypes.includes(fileType);
  };

  const renderOption = (option, index) => {
    const Icon = option.icon;
    const isSelected = selected === option.id;
    const disabled = isOptionDisabled(option);

    return (
      <motion.button
        key={option.id}
        id={`conversion-${option.id}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => !disabled && onSelect(option.id)}
        disabled={disabled}
        className={`relative group p-4 rounded-xl text-left transition-all duration-300 cursor-pointer border ${
          disabled
            ? darkMode
              ? 'opacity-30 cursor-not-allowed bg-slate-800/10 border-transparent'
              : 'opacity-30 cursor-not-allowed bg-slate-50 border-transparent'
            : isSelected
            ? darkMode
              ? 'bg-gradient-to-br ' + option.gradient + ' border-transparent shadow-xl ' + option.shadowColor + ' ring-2 ring-white/20'
              : 'bg-gradient-to-br ' + option.gradient + ' border-transparent shadow-xl ' + option.shadowColor + ' ring-2 ring-white/50'
            : darkMode
            ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-white/20 text-white'
                : darkMode
                ? `${option.bgDark} ${option.textDark}`
                : `${option.bgLight} ${option.textLight}`
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className={`font-bold text-xs truncate ${isSelected ? 'text-white' : darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {option.label}
            </p>
            <p className={`text-[10px] truncate ${isSelected ? 'text-white/70' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {option.description}
            </p>
          </div>
        </div>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-primary-500"
          >
            <svg className="w-2.5 h-2.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </motion.button>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Select Conversion Type
        </h3>
        {fileType && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${darkMode ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
            Auto-Filtered
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {popularOptions.map((opt, i) => renderOption(opt, i))}
      </div>

      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`mt-2 mb-4 p-1 rounded-2xl border ${
              darkMode ? 'border-white/5 bg-slate-900/50' : 'border-black/5 bg-slate-50/50'
            }`}>
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-3 space-y-2">
                {remainingOptions.map((opt, i) => renderOption(opt, i + 4))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowMore(!showMore)}
        className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
          showMore
            ? darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-600'
            : darkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900'
        }`}
      >
        {showMore ? (
          <>
            Show Less <HiOutlineChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            View More Options <HiOutlineChevronDown className="w-4 h-4" />
          </>
        )}
      </button>

      {fileType && !showMore && (
        <p className={`mt-3 text-[10px] text-center ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          More options available below matching your file.
        </p>
      )}
    </div>
  );
}
