import { useTheme } from '../context/ThemeContext';
import { 
  HiOutlineHeart, 
  HiOutlineShieldCheck, 
  HiOutlineLockClosed, 
  HiOutlineCloudArrowUp 
} from 'react-icons/hi2';
import { 
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaFacebook 
} from 'react-icons/fa';

export default function Footer() {
  const { darkMode } = useTheme();

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Converter',
      links: [
        { label: 'Video Converter', href: '#' },
        { label: 'Audio Converter', href: '#' },
        { label: 'Image Converter', href: '#' },
        { label: 'Document Converter', href: '#' },
        { label: 'Archive Converter', href: '#' },
      ]
    },
    {
      title: 'Useful Tools',
      links: [
        { label: 'Compress PDF', href: '#' },
        { label: 'Merge PDF', href: '#' },
        { label: 'Video to GIF', href: '#' },
        { label: 'Resize Image', href: '#' },
        { label: 'Extract Text', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Contact Support', href: '#' },
      ]
    }
  ];

  return (
    <footer
      className={`border-t transition-colors duration-500 ${
        darkMode
          ? 'bg-slate-950 border-white/5'
          : 'bg-slate-50 border-black/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                ConvertHub
              </span>
            </div>
            <p className={`text-sm leading-relaxed mb-6 max-w-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              The most powerful online file converter. Transform images, documents, and videos into any format with 100% privacy and security. Our cloud-powered engine ensures fast results without any software installation.
            </p>
            <div className="flex items-center gap-4">
              {[FaTwitter, FaGithub, FaLinkedin, FaFacebook].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    darkMode 
                      ? 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-primary-400 border border-white/5' 
                      : 'bg-white text-slate-500 hover:bg-primary-50 hover:text-primary-600 border border-black/5 shadow-sm'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className={`text-sm font-bold uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className={`text-sm transition-colors ${
                        darkMode ? 'text-slate-400 hover:text-primary-400' : 'text-slate-600 hover:text-primary-600'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className={`py-10 border-y ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <div className="flex items-center gap-3">
              <HiOutlineShieldCheck className="w-6 h-6 text-emerald-500" />
              <div className="text-left">
                <p className={`text-xs font-bold leading-none ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>100% SECURE</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Bank-level encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlineLockClosed className="w-6 h-6 text-blue-500" />
              <div className="text-left">
                <p className={`text-xs font-bold leading-none ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>PRIVACY FIRST</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Files deleted in 24h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlineCloudArrowUp className="w-6 h-6 text-amber-500" />
              <div className="text-left">
                <p className={`text-xs font-bold leading-none ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>CLOUD POWERED</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Zero local resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            &copy; {currentYear} ConvertHub. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className={darkMode ? 'text-slate-500' : 'text-slate-400'}>Distributed by</span>
            <span className="gradient-text font-bold">Dani Mughal</span>
          </div>
          <p className="text-xs flex items-center gap-1.5 text-slate-500">
            Made with <HiOutlineHeart className="w-4 h-4 text-red-500 animate-pulse" /> for the web
          </p>
        </div>
      </div>
    </footer>
  );
}
