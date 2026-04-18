import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineDocumentText,
  HiOutlineTableCells,
  HiOutlinePhoto,
} from 'react-icons/hi2';

const CONVERSION_OPTIONS = [
  {
    id: 'pdf-to-word',
    label: 'PDF → Word',
    description: 'Convert PDF documents to editable DOCX',
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
    description: 'Extract tables from PDF to XLSX spreadsheet',
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
    description: 'Convert DOC and DOCX files to PDF',
    icon: HiOutlineDocumentText,
    acceptedTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    gradient: 'from-purple-500 to-pink-600',
    shadowColor: 'shadow-purple-500/20',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-500/10',
    textLight: 'text-purple-600',
    textDark: 'text-purple-400',
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
