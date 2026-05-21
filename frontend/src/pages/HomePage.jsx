import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../context/ThemeContext';
import { seoConfig } from '../config/seoConfig';
import {
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineCloud,
  HiOutlineLockClosed,
  HiOutlineArrowPathRoundedSquare,
  HiOutlineQueueList,
  HiOutlineArchiveBox,
  HiOutlinePlay
} from 'react-icons/hi2';
import { FileStack } from 'lucide-react';
import ConversionGrid from '../components/ConversionGrid';
import TutorialModal from '../components/TutorialModal';
import { trackEvent } from '../components/AnalyticsTracker';
import SEO from '../components/SEO';
import { getSeoConfig } from '../config/seoConfig';


const FEATURES = [
  {
    icon: HiOutlineQueueList,
    title: '1000+ Combinations',
    description: 'Support for nearly every file format including PDF, DOCX, XLSX, and more.',
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-500/10',
    textColor: 'text-amber-500',
  },
  {
    icon: HiOutlineBolt,
    title: 'Fast Processing',
    description: 'Lightning-fast cloud servers process your files in seconds.',
    color: 'from-sky-400 to-blue-500',
    bgLight: 'bg-sky-50',
    bgDark: 'bg-sky-500/10',
    textColor: 'text-sky-500',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure & Private',
    description: 'We prioritize your privacy. All files are automatically deleted after 30 minutes.',
    color: 'from-emerald-400 to-teal-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
  },
  {
    icon: HiOutlineQueueList,
    title: 'Batch Conversion',
    description: 'Upload and convert multiple files simultaneously with ease.',
    color: 'from-primary-400 to-blue-600',
    bgLight: 'bg-primary-50',
    bgDark: 'bg-primary-500/10',
    textColor: 'text-primary-500',
  },
  {
    icon: HiOutlineArchiveBox,
    title: 'ZIP & Unzip Support',
    description: 'Compress files into ZIP archives or extract them instantly.',
    color: 'from-rose-400 to-red-500',
    bgLight: 'bg-rose-50',
    bgDark: 'bg-rose-500/10',
    textColor: 'text-rose-500',
  },
  {
    icon: HiOutlineCloud,
    title: 'No Software Needed',
    description: '100% online. No installation required, works in any browser.',
    color: 'from-cyan-400 to-teal-500',
    bgLight: 'bg-cyan-50',
    bgDark: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
  },
];

const TRUST_POINTS = [
  {
    icon: HiOutlineLockClosed,
    title: 'End-to-End Encryption',
    text: 'All file transfers are secured with SSL 256-bit encryption for maximum privacy.'
  },
  {
    icon: HiOutlineArrowPathRoundedSquare,
    title: 'Automatic Deletion',
    text: 'We respect your data. All uploaded files are permanently deleted from our servers after 30 minutes.'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Zero Data Selling',
    text: 'We never store, share, or sell your files or personal information to third parties.'
  }
];

export default function HomePage() {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const gridRef = useRef(null);

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const openTutorial = () => {
    setIsTutorialOpen(true);
    trackEvent('tutorial_opened', { source: 'hero_button' });
  };

  const seo = getSeoConfig(''); // Default config

  return (
    <div className="min-h-screen">
      <SEO config={seo} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-48 sm:pb-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${darkMode ? 'bg-[radial-gradient(circle_at_top_right,#2563eb_0%,transparent_50%)]' : 'bg-[radial-gradient(circle_at_top_right,#dbeafe_0%,transparent_50%)]'}`} />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px] animate-float-delay" />
        </div>


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase ${
                darkMode
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                  : 'bg-primary-50 text-primary-600 border border-primary-100 shadow-sm'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Production-Grade File Conversion
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className={`mt-10 text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Universal File <br className="hidden sm:block" />
            <span className="gradient-text drop-shadow-sm">Converter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`mt-8 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Professional tools for PDF, Image, and Media conversion. 
            Fast, secure, and entirely online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-primary-500/20 blur-2xl group-hover:bg-primary-500/30 transition-all duration-500 rounded-full" />
              <div className={`relative flex items-center p-2 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-xl shadow-2xl shadow-black/5`}>
                <div className="pl-4 pr-3">
                  <svg className={`w-6 h-6 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text"
                  id="hero-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search 1000+ conversion tools (e.g. PDF to Word)"
                  className="w-full bg-transparent border-none focus:ring-0 text-lg py-3 placeholder:text-slate-500 font-medium outline-none"
                />
                <button
                  onClick={handleSearch}
                  id="hero-search-btn"
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 active:scale-95 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/convert"
              id="hero-cta"
              className="group relative inline-flex items-center gap-3 px-10 py-5 gradient-bg text-white font-bold rounded-2xl shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 text-lg">Start Converting</span>
              <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              onClick={openTutorial}
              id="hero-tutorial-btn"
              className={`flex items-center gap-3 px-10 py-5 font-bold rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <HiOutlinePlay className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              How it works
            </button>
            <div className="flex flex-col items-start gap-1">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 ${darkMode ? 'border-slate-900' : 'border-white'} bg-slate-200 overflow-hidden`}>
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <span className={`text-sm font-semibold flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>Trusted by 10,000+ users</span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                <span className="flex items-center gap-1"><span className="text-amber-400 text-lg">★★★★★</span> 4.9/5</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Trust Section */}
      <section className={`py-16 ${darkMode ? 'bg-slate-900/30' : 'bg-slate-100/50'} border-y ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {TRUST_POINTS.map((point, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center md:items-start text-center md:text-left gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/5 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
                  <point.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{point.title}</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{point.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-12 ${darkMode ? 'bg-slate-900/30' : 'bg-slate-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-black mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Loved by our Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-200'} shadow-sm text-left`}>
              <div className="text-amber-400 text-xl mb-3">★★★★★</div>
              <p className={`italic mb-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"Fast and accurate PDF conversion."</p>
              <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>— Sarah K.</div>
            </div>
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-200'} shadow-sm text-left`}>
              <div className="text-amber-400 text-xl mb-3">★★★★★</div>
              <p className={`italic mb-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"Best free converter I found online."</p>
              <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>— David R.</div>
            </div>
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-200'} shadow-sm text-left`}>
              <div className="text-amber-400 text-xl mb-3">★★★★★</div>
              <p className={`italic mb-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"SVG conversion quality is excellent."</p>
              <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>— Ali M.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Grid Component */}
      <div ref={gridRef}>
        <ConversionGrid externalSearch={activeSearch} />
      </div>



      {/* Features Section */}
      <section className={`py-28 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Fast, Secure, and High-Quality Conversions
            </h2>
            <p className={`mt-4 text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Everything you need to process files professionally, all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`group relative p-10 rounded-[2.5rem] transition-all duration-500 ${
                    darkMode
                      ? 'bg-slate-900/40 border border-white/5 hover:border-primary-500/30'
                      : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary-200'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                      darkMode ? f.bgDark : f.bgLight
                    } ${f.textColor}`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {f.title}
                  </h3>
                  <p className={`text-lg leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className={`absolute inset-0 ${darkMode ? 'bg-primary-900/20' : 'bg-primary-50/50'}`} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl sm:text-6xl font-black mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Stop Waiting, <br /> Start Converting.
            </h2>
            <p className={`text-xl mb-12 max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Join millions of users who trust ConverterHub for their daily file processing needs. No credit card required.
            </p>
            <Link
              to="/convert"
              id="bottom-cta"
              className="inline-flex items-center gap-3 px-12 py-6 gradient-bg text-white font-bold rounded-2xl shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              Get Started Now — It's Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
}
