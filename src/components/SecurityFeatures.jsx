import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Clock, CheckCircle, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
  {
    id: 'deletion',
    icon: Clock,
    title: 'Automatic Deletion',
    text: 'Your files are automatically deleted after 15 minutes.',
    color: 'emerald',
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'We do not store, view, or share your files.',
    text: 'We respect your privacy. No files are stored or shared.',
    color: 'blue',
  },
  {
    id: 'encryption',
    icon: Lock,
    title: 'All file transfers are encrypted.',
    text: 'Your data is protected with SSL/TLS encryption.',
    color: 'cyan',
  },
];

export default function SecurityFeatures() {
  const { darkMode } = useTheme();
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.id}
            whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            className={`p-5 rounded-2xl border transition-all duration-300 ${
              darkMode
                ? 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${feature.color}-500/10 text-${feature.color}-500`}>
              <feature.icon className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {feature.id === 'deletion' ? 'Auto-Delete' : feature.id === 'privacy' ? 'Privacy First' : 'Secure Transfer'}
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {feature.text}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowLearnMore(!showLearnMore)}
          className={`group flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer ${
            darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          {showLearnMore ? 'Show less' : 'Learn more about our security'}
        </button>
      </div>

      <AnimatePresence>
        {showLearnMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden rounded-2xl p-5 ${
              darkMode ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'
            }`}
          >
            <div className="flex gap-4">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Secure Processing Guarantee
                </p>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Files are processed securely and permanently deleted from our servers after conversion. 
                  No backups are stored, and no manual viewing of files is performed by our staff. 
                  Your data remaining private is our top priority.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
