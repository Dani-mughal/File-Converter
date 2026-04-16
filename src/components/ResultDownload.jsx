import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineArrowDownTray, HiOutlineArrowPath } from 'react-icons/hi2';

export default function ResultDownload({ downloadUrl, fileName, onReset }) {
  const { darkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      id="result-download"
      className={`w-full rounded-2xl p-8 text-center ${
        darkMode
          ? 'bg-slate-800/50 border border-slate-700/50'
          : 'bg-white border border-slate-200 shadow-sm'
      }`}
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
        className="mx-auto w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-6"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </motion.div>

      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
        File Ready!
      </h3>
      <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Your converted file <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{fileName}</span> is ready for download.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <motion.a
          href={downloadUrl}
          download={fileName}
          id="download-btn"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 gradient-bg text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow text-sm"
        >
          <HiOutlineArrowDownTray className="w-5 h-5" />
          Download File
        </motion.a>

        <motion.button
          onClick={onReset}
          id="convert-another-btn"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            darkMode
              ? 'bg-slate-700 text-white hover:bg-slate-600'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <HiOutlineArrowPath className="w-5 h-5" />
          Convert Another
        </motion.button>
      </div>
    </motion.div>
  );
}
