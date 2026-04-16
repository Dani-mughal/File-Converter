import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineTrash, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const conversionLabels = {
  'pdf-to-word': 'PDF → Word',
  'pdf-to-excel': 'PDF → Excel',
  'image-to-pdf': 'Image → PDF',
};

export default function FileHistoryPanel({ history, onClear, onRemove }) {
  const { darkMode } = useTheme();

  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <HiOutlineClock className="w-4 h-4" />
          Recent Conversions
        </h3>
        <button
          onClick={onClear}
          id="clear-history-btn"
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            darkMode
              ? 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'
              : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          Clear All
        </button>
      </div>

      <div
        className={`rounded-2xl overflow-hidden divide-y ${
          darkMode
            ? 'bg-slate-800/30 border border-slate-700/50 divide-slate-700/50'
            : 'bg-white border border-slate-200 divide-slate-100'
        }`}
      >
        <AnimatePresence>
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`flex items-center gap-3 px-4 py-3.5 group transition-colors ${
                darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.status === 'success'
                    ? darkMode
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-emerald-50 text-emerald-500'
                    : darkMode
                    ? 'bg-red-500/15 text-red-400'
                    : 'bg-red-50 text-red-500'
                }`}
              >
                {item.status === 'success' ? (
                  <HiOutlineCheckCircle className="w-4 h-4" />
                ) : (
                  <HiOutlineXCircle className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  {item.fileName}
                </p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {conversionLabels[item.conversionType] || item.conversionType} • {formatSize(item.fileSize)} • {timeAgo(item.timestamp)}
                </p>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer ${
                  darkMode
                    ? 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'
                    : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                }`}
                aria-label="Remove entry"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
