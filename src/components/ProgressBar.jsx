import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ProgressBar({ progress, status }) {
  const { darkMode } = useTheme();

  const statusLabels = {
    uploading: 'Uploading file...',
    converting: 'Converting your file...',
    done: 'Conversion complete!',
    error: 'Conversion failed',
  };

  const label = statusLabels[status] || 'Processing...';
  const isComplete = status === 'done';
  const isError = status === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id="progress-section"
      className={`w-full rounded-2xl p-8 text-center ${
        darkMode
          ? 'bg-slate-800/50 border border-slate-700/50'
          : 'bg-white border border-slate-200 shadow-sm'
      }`}
    >
      {/* Animated Icon */}
      <div className="mb-6">
        {isComplete ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
        ) : (
          <div className="mx-auto w-16 h-16 rounded-full gradient-bg flex items-center justify-center animate-pulse-slow">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Status */}
      <p className={`text-lg font-semibold mb-2 ${
        isError
          ? 'text-red-500'
          : isComplete
          ? 'text-emerald-500'
          : darkMode
          ? 'text-white'
          : 'text-slate-800'
      }`}>
        {label}
      </p>

      {/* Progress Bar */}
      {!isError && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Progress
            </span>
            <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-700'}`}>
              {Math.min(progress, 100)}%
            </span>
          </div>
          <div
            className={`w-full h-2.5 rounded-full overflow-hidden ${
              darkMode ? 'bg-slate-700' : 'bg-slate-100'
            }`}
          >
            <motion.div
              className={`h-full rounded-full relative ${
                isComplete ? 'bg-emerald-500' : 'gradient-bg'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {!isComplete && (
                <div className="absolute inset-0 shimmer" />
              )}
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
