import { useTheme } from '../context/ThemeContext';
import { HiOutlineHeart } from 'react-icons/hi2';

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        darkMode
          ? 'bg-slate-900/50 border-white/5 text-slate-500'
          : 'bg-white/50 border-black/5 text-slate-400'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              ConvertHub
            </span>
          </div>

          {/* Center */}
          <p className="text-sm flex items-center gap-1">
            Made with <HiOutlineHeart className="w-4 h-4 text-red-400" /> for seamless file conversion
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-slate-700'}`}>
              Privacy
            </a>
            <a href="#" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-slate-700'}`}>
              Terms
            </a>
            <a href="#" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-slate-700'}`}>
              Contact
            </a>
          </div>
        </div>

        <div className={`mt-6 pt-6 border-t text-center text-xs ${
          darkMode ? 'border-white/5 text-slate-600' : 'border-black/5 text-slate-300'
        }`}>
          &copy; {new Date().getFullYear()} ConvertHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
