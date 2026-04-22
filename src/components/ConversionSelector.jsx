import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineDocumentText,
  HiOutlineTableCells,
  HiOutlinePhoto,
  HiOutlinePresentationChartBar,
  HiOutlineArchiveBox,
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
  {
    id: 'pdf-to-word',
    label: 'PDF → Word',
    description: 'Convert PDF to DOCX',
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
    id: 'ppt-to-pdf',
    label: 'PPT → PDF',
    description: 'Convert Slides to PDF',
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
    id: 'pdf-to-ppt',
    label: 'PDF → PPT',
    description: 'Convert PDF to Slides',
    icon: HiOutlinePresentationChartBar,
    acceptedTypes: ['application/pdf'],
    gradient: 'from-rose-500 to-pink-600',
    shadowColor: 'shadow-rose-500/20',
    bgLight: 'bg-rose-50',
    bgDark: 'bg-rose-500/10',
    textLight: 'text-rose-600',
    textDark: 'text-rose-400',
  },
  {
    id: 'excel-to-pdf',
    label: 'Excel → PDF',
    description: 'Convert Spreadsheets',
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
    id: 'image-to-pdf',
    label: 'Image → PDF',
    description: 'Convert JPG/PNG to PDF',
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
    id: 'pdf-to-image',
    label: 'PDF → Image',
    description: 'Render PDF to PNG',
    icon: HiOutlinePhoto,
    acceptedTypes: ['application/pdf'],
    gradient: 'from-sky-500 to-indigo-600',
    shadowColor: 'shadow-sky-500/20',
    bgLight: 'bg-sky-50',
    bgDark: 'bg-sky-500/10',
    textLight: 'text-sky-600',
    textDark: 'text-sky-400',
  },
  {
    id: 'csv-to-pdf',
    label: 'CSV → PDF',
    description: 'Convert Comma Separated',
    icon: HiOutlineTableCells,
    acceptedTypes: ['text/csv'],
    gradient: 'from-yellow-500 to-amber-600',
    shadowColor: 'shadow-yellow-500/20',
    bgLight: 'bg-yellow-50',
    bgDark: 'bg-yellow-500/10',
    textLight: 'text-yellow-600',
    textDark: 'text-yellow-400',
  },
  {
    id: 'pdf-to-csv',
    label: 'PDF → CSV',
    description: 'Extract PDF to CSV',
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
    label: 'Zip File',
    description: 'Archive your file',
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
