import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePlay, HiOutlineVideoCamera } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from './AnalyticsTracker';

/**
 * Reusable Tutorial Video Section
 * Supports YouTube embed and responsive design.
 */
export default function TutorialVideo({ title, videoId = "BgUhiaQtyfY" }) {
  const { darkMode } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    trackEvent('tutorial_video_played', { title, videoId });
  };

  return (
    <div className={`mt-24 p-10 rounded-[3rem] border ${
      darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 text-center lg:text-left">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 ${
            darkMode ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'
          }`}>
            <HiOutlineVideoCamera className="w-6 h-6" />
          </div>
          <h2 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {title || "How to Use ConverterHub"}
          </h2>
          <p className={`text-lg leading-relaxed mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Watch our quick walkthrough to see how you can convert files, manage batch uploads, 
            and download professional results in seconds. No software installation needed.
          </p>
          <ul className="space-y-3 mb-8">
            {['No sign-up required', 'Secure SSL processing', 'Batch file support'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-bold text-emerald-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 w-full max-w-2xl">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`group relative aspect-video rounded-[2rem] overflow-hidden border shadow-2xl ${
              darkMode ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <iframe
              title="ConverterHub Video Tutorial"
              className="absolute inset-0 w-full h-full object-cover"
              src={`https://www.youtube.com/embed/${videoId}?si=xe3eEwaV2mrUQ2RE&controls=1${isPlaying ? '&autoplay=1' : ''}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            
            {!isPlaying && (
              <>
                {/* Overlay for play button effect */}
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all pointer-events-none" />
                
                <button 
                  onClick={handlePlay}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform">
                    <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg">
                      <HiOutlinePlay className="w-8 h-8 ml-1" />
                    </div>
                  </div>
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
