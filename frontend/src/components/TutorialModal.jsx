import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineXMark, HiOutlinePlay } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from './AnalyticsTracker';

const STEPS = [
  {
    title: 'Select Converter',
    desc: 'Choose from 1000+ combinations from our home search or tool grid.',
    icon: '🔍'
  },
  {
    title: 'Upload Files',
    desc: 'Drag & drop or click to upload. We support files up to 512MB.',
    icon: '📁'
  },
  {
    title: 'Convert',
    desc: 'Hit the convert button and watch our cloud engine process your file.',
    icon: '⚙️'
  },
  {
    title: 'Download',
    desc: 'Get your professional-grade result instantly. Safe and secure.',
    icon: '✅'
  }
];

export default function TutorialModal({ isOpen, onClose }) {
  const { darkMode } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const handlePlay = () => {
    setIsPlaying(true);
    trackEvent('tutorial_video_played', { type: 'youtube' });
  };

  const handleClose = () => {
    setIsPlaying(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-4xl rounded-[2.5rem] border overflow-hidden shadow-2xl ${
            darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header */}
          <div className="p-8 pb-0 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black gradient-text">How it Works</h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Professional file conversion in 4 easy steps</p>
            </div>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Steps List */}
            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${
                    darkMode ? 'bg-slate-800' : 'bg-slate-50'
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {i + 1}. {step.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Video Section */}
            <div className="space-y-4">
              <div className={`group relative aspect-video rounded-3xl overflow-hidden border shadow-lg ${
                darkMode ? 'bg-slate-800 border-white/5' : 'bg-slate-100 border-slate-200'
              }`}>
                <iframe
                  title="Tutorial Video"
                  className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                  src={`https://www.youtube-nocookie.com/embed/BgUhiaQtyfY?si=xe3eEwaV2mrUQ2RE&controls=1${isPlaying ? '&autoplay=1' : ''}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                {!isPlaying && (
                  <>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/40 to-transparent" />
                    
                    <button 
                      onClick={handlePlay}
                      className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform z-10"
                    >
                      <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-2xl">
                        <HiOutlinePlay className="w-8 h-8 ml-1" />
                      </div>
                    </button>
                  </>
                )}
              </div>
              <p className={`text-[10px] text-center font-bold uppercase tracking-widest ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                Watch Tutorial: Professional Results in Seconds
              </p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className={`p-8 border-t ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <button
              onClick={handleClose}
              className="w-full py-4 gradient-bg text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all"
            >
              Get Started Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
