import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineCloudArrowUp,
  HiOutlineDocument,
  HiOutlineXMark,
  HiOutlinePhoto,
} from 'react-icons/hi2';

const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50 MB

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(type) {
  return <HiOutlineDocument className="w-6 h-6" />;
}

export default function FileUpload({ file, onFileSelect, onFileRemove, error }) {
  const { darkMode } = useTheme();

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const err = rejectedFiles[0].errors[0];
        if (err.code === 'file-too-large') {
          onFileSelect(null, `File exceeds ${formatSize(FILE_SIZE_LIMIT)} limit.`);
        } else if (err.code === 'file-invalid-type') {
          onFileSelect(null, 'Unsupported file type. Use PDF, DOC, or DOCX.');
        } else {
          onFileSelect(null, err.message);
        }
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0], null);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: FILE_SIZE_LIMIT,
    multiple: false,
  });

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              {...getRootProps()}
              id="file-dropzone"
              className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                isDragActive
                  ? darkMode
                    ? 'border-primary-400 bg-primary-500/10'
                    : 'border-primary-500 bg-primary-50'
                  : darkMode
                  ? 'border-slate-700 hover:border-primary-500/50 bg-slate-800/50 hover:bg-slate-800'
                  : 'border-slate-200 hover:border-primary-400 bg-slate-50/50 hover:bg-primary-50/50'
              }`}
            >
              <input {...getInputProps()} id="file-input" />

              {/* Animated Background Orbs */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 ${
                  isDragActive ? 'opacity-30' : 'opacity-0 group-hover:opacity-15'
                } bg-primary-500`} />
                <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 ${
                  isDragActive ? 'opacity-30' : 'opacity-0 group-hover:opacity-15'
                } bg-accent-500`} />
              </div>

              <div className="relative">
                <motion.div
                  animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
                    isDragActive
                      ? 'gradient-bg shadow-lg shadow-primary-500/30'
                      : darkMode
                      ? 'bg-slate-700 group-hover:bg-primary-500/20'
                      : 'bg-slate-100 group-hover:bg-primary-100'
                  } transition-all duration-300`}
                >
                  <HiOutlineCloudArrowUp
                    className={`w-8 h-8 transition-colors duration-300 ${
                      isDragActive
                        ? 'text-white'
                        : darkMode
                        ? 'text-slate-400 group-hover:text-primary-400'
                        : 'text-slate-400 group-hover:text-primary-500'
                    }`}
                  />
                </motion.div>

                <h3
                  className={`text-lg font-semibold mb-2 transition-colors ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your file'}
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  or{' '}
                  <span className="text-primary-500 font-medium hover:underline">browse</span>{' '}
                  to choose a file
                </p>
                <div
                  className={`inline-flex flex-wrap items-center justify-center gap-2 text-xs ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {['PDF', 'DOC', 'DOCX'].map((ext) => (
                    <span
                      key={ext}
                      className={`px-2.5 py-1 rounded-lg ${
                        darkMode ? 'bg-slate-700/50' : 'bg-slate-100'
                      }`}
                    >
                      .{ext.toLowerCase()}
                    </span>
                  ))}
                  <span>• Max {formatSize(FILE_SIZE_LIMIT)}</span>
                </div>
                
                <div className={`mt-6 flex items-center justify-center gap-1.5 text-xs font-medium opacity-60 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <Lock className="w-3 h-3" />
                  <span>Your files are private and auto-deleted</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            id="file-preview"
            className={`rounded-2xl p-6 transition-colors ${
              darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50 border border-slate-200'
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    darkMode ? 'bg-primary-500/15 text-primary-400' : 'bg-primary-50 text-primary-600'
                  }`}
                >
                  {getFileIcon(file.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {file.name}
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {formatSize(file.size)} • {file.type || 'Unknown type'}
                  </p>
                </div>

                <button
                  onClick={onFileRemove}
                  id="remove-file-btn"
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    darkMode
                      ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10'
                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                  aria-label="Remove file"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>

              <div className={`flex items-center justify-center gap-1.5 text-xs font-medium opacity-60 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                <Lock className="w-3 h-3" />
                <span>Your files are private and auto-deleted</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 text-sm text-red-500 font-medium flex items-center gap-1.5"
            id="file-error"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
