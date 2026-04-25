import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineDocumentText,
  HiOutlineTableCells,
  HiOutlinePhoto,
  HiOutlineVideoCamera,
  HiOutlineArchiveBox,
} from 'react-icons/hi2';

const ALL_MIME_TYPES = ['*/*'];

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

  // --- Extended Section (Media) ---
  {
    id: 'mp4-to-mp3',
    label: 'MP4 → MP3',
    description: 'Extract Audio',
    category: 'Media',
    icon: HiOutlineVideoCamera,
    acceptedTypes: ['video/mp4'],
    gradient: 'from-rose-500 to-red-600',
    shadowColor: 'shadow-rose-500/20',
    bgLight: 'bg-rose-50',
    bgDark: 'bg-rose-500/10',
    textLight: 'text-rose-600',
    textDark: 'text-rose-400',
  },
  {
    id: 'mp3-to-ogg',
    label: 'MP3 → OGG',
    description: 'Audio Format Shift',
    category: 'Media',
    icon: HiOutlineVideoCamera,
    acceptedTypes: ['audio/mpeg'],
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/20',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-500/10',
    textLight: 'text-amber-600',
    textDark: 'text-amber-400',
  },
  {
    id: 'video-to-gif',
    label: 'Video → GIF',
    description: 'Create animation',
    category: 'Media',
    icon: HiOutlinePhoto,
    acceptedTypes: ['video/mp4', 'video/quicktime'],
    gradient: 'from-indigo-500 to-purple-600',
    shadowColor: 'shadow-indigo-500/20',
    bgLight: 'bg-indigo-50',
    bgDark: 'bg-indigo-500/10',
    textLight: 'text-indigo-600',
    textDark: 'text-indigo-400',
  },

  // --- Extended Section (Images) ---
  {
    id: 'webp-to-png',
    label: 'WEBP → PNG',
    description: 'Process Web Graphics',
    category: 'Graphic',
    icon: HiOutlinePhoto,
    acceptedTypes: ['image/webp'],
    gradient: 'from-teal-500 to-cyan-600',
    shadowColor: 'shadow-teal-500/20',
    bgLight: 'bg-teal-50',
    bgDark: 'bg-teal-500/10',
    textLight: 'text-teal-600',
    textDark: 'text-teal-400',
  },
  {
    id: 'heic-to-jpg',
    label: 'HEIC → JPG',
    description: 'iPhone to Browser',
    category: 'Graphic',
    icon: HiOutlinePhoto,
    acceptedTypes: ['image/heic', 'image/heif'],
    gradient: 'from-blue-400 to-indigo-500',
    shadowColor: 'shadow-blue-400/20',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-500/10',
    textLight: 'text-blue-600',
    textDark: 'text-blue-400',
  },
  {
    id: 'png-to-svg',
    label: 'PNG → SVG',
    description: 'Vectorize Image',
    category: 'Graphic',
    icon: HiOutlinePhoto,
    acceptedTypes: ['image/png'],
    gradient: 'from-violet-500 to-fuchsia-600',
    shadowColor: 'shadow-violet-500/20',
    bgLight: 'bg-violet-50',
    bgDark: 'bg-violet-500/10',
    textLight: 'text-violet-600',
    textDark: 'text-violet-400',
  },

  // --- Extended Section (Documents) ---
  {
    id: 'pdf-to-jpg',
    label: 'PDF → JPG',
    description: 'Render PDF Pages',
    category: 'Document',
    icon: HiOutlinePhoto,
    acceptedTypes: ['application/pdf'],
    gradient: 'from-sky-500 to-blue-600',
    shadowColor: 'shadow-sky-500/20',
    bgLight: 'bg-sky-50',
    bgDark: 'bg-sky-500/10',
    textLight: 'text-sky-600',
    textDark: 'text-sky-400',
  },
  {
    id: 'docx-to-pdf',
    label: 'DOCX → PDF',
    description: 'Save as PDF',
    category: 'Document',
    icon: HiOutlineDocumentText,
    acceptedTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    gradient: 'from-emerald-500 to-green-600',
    shadowColor: 'shadow-emerald-500/20',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-500/10',
    textLight: 'text-emerald-600',
    textDark: 'text-emerald-400',
  },
  {
    id: 'epub-to-pdf',
    label: 'EPUB → PDF',
    description: 'Ebook to Document',
    category: 'Document',
    icon: HiOutlineDocumentText,
    acceptedTypes: ['application/epub+zip'],
    gradient: 'from-orange-500 to-amber-600',
    shadowColor: 'shadow-orange-500/20',
    bgLight: 'bg-orange-50',
    bgDark: 'bg-orange-500/10',
    textLight: 'text-orange-600',
    textDark: 'text-orange-400',
  },

  // --- System ---
  {
    id: 'zip',
    label: 'Zip Archive',
    description: 'Compress files',
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
    description: 'Extract archive',
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
];

export default function ConversionSelector({ selected, onSelect, fileType }) {
  const { darkMode } = useTheme();

  const isOptionDisabled = (option) => {
    if (!fileType) return false;
    return !option.acceptedTypes.includes(fileType);
  };

  return (
    <div className="w-full">
      <h3
        className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        Select Conversion Type
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CONVERSION_OPTIONS.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selected === option.id;
          const disabled = isOptionDisabled(option);

          return (
            <motion.button
              key={option.id}
              id={`conversion-${option.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => !disabled && onSelect(option.id)}
              disabled={disabled}
              className={`relative group p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer ${
                disabled
                  ? darkMode
                    ? 'opacity-30 cursor-not-allowed bg-slate-800/30'
                    : 'opacity-30 cursor-not-allowed bg-slate-50'
                  : isSelected
                  ? darkMode
                    ? 'bg-gradient-to-br ' + option.gradient + ' shadow-xl ' + option.shadowColor + ' ring-2 ring-white/20'
                    : 'bg-gradient-to-br ' + option.gradient + ' shadow-xl ' + option.shadowColor + ' ring-2 ring-white/50'
                  : darkMode
                  ? 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : darkMode
                    ? `${option.bgDark} ${option.textDark}`
                    : `${option.bgLight} ${option.textLight}`
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <p
                className={`font-semibold text-sm ${
                  isSelected
                    ? 'text-white'
                    : darkMode
                    ? 'text-white'
                    : 'text-slate-800'
                }`}
              >
                {option.label}
              </p>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  isSelected
                    ? 'text-white/70'
                    : darkMode
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                {option.description}
              </p>

              {/* Selected Check */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-white/25 rounded-full flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {fileType && (
        <p className={`mt-3 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Options are filtered based on your uploaded file type.
        </p>
      )}
    </div>
  );
}
