import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineInformationCircle, HiOutlineXMark } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[60] md:left-auto md:max-w-md"
        >
          <div className={`p-6 rounded-[2rem] border shadow-2xl backdrop-blur-xl ${
            darkMode 
              ? 'bg-slate-900/90 border-white/10 text-white' 
              : 'bg-white/90 border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                <HiOutlineInformationCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-2">We value your privacy</h3>
                <p className={`text-xs leading-relaxed mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. 
                  Read our <Link to="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link> for more.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-primary-500/25"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className={`px-6 py-3 border text-xs font-bold rounded-xl transition-all ${
                      darkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Customize
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/5 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
