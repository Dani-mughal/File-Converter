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
  HiOutlinePlay,
  HiOutlineGlobeAlt
} from 'react-icons/hi2';
import { FileStack } from 'lucide-react';
import ConversionGrid from '../components/ConversionGrid';
import TutorialModal from '../components/TutorialModal';
import { trackEvent } from '../components/AnalyticsTracker';
import SEO from '../components/SEO';
import { getSeoConfig } from '../config/seoConfig';


const FEATURES = [
  {
    icon: HiOutlineLockClosed,
    title: 'Bank-Grade Security',
    description: 'Every file transfer is secured with 256-bit SSL encryption. We don\'t just process files; we protect your digital privacy.',
    color: 'from-emerald-400 to-teal-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
  },
  {
    icon: HiOutlineBolt,
    title: 'Lightning Cloud Processing',
    description: 'Our global server network ensures that even the most complex multi-page document conversions happen in seconds, not minutes.',
    color: 'from-sky-400 to-blue-500',
    bgLight: 'bg-sky-50',
    bgDark: 'bg-sky-500/10',
    textColor: 'text-sky-500',
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Cross-Platform Harmony',
    description: 'Access your dedicated workstation from any device—Windows, macOS, iOS, or Android—without ever downloading a single megabyte of software.',
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-500/10',
    textColor: 'text-amber-500',
  },
  {
    icon: HiOutlineArrowPathRoundedSquare,
    title: 'Zero-Retention Policy',
    description: 'We respect your data. All uploaded and processed files are automatically and permanently purged from our servers within 30 minutes.',
    color: 'from-primary-400 to-blue-600',
    bgLight: 'bg-primary-50',
    bgDark: 'bg-primary-500/10',
    textColor: 'text-primary-500',
  },
  {
    icon: HiOutlineQueueList,
    title: '1000+ Combinations',
    description: 'Comprehensive support for nearly every file format including PDF, DOCX, XLSX, images, and more.',
    color: 'from-rose-400 to-red-500',
    bgLight: 'bg-rose-50',
    bgDark: 'bg-rose-500/10',
    textColor: 'text-rose-500',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'High-Fidelity Results',
    description: 'Our advanced conversion engines maintain fonts, layouts, and image resolution with pixel-perfect precision.',
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
    text: 'All file transfers are secured with SSL 256-bit encryption for maximum privacy and data integrity.'
  },
  {
    icon: HiOutlineArrowPathRoundedSquare,
    title: 'Zero Data Retention',
    text: 'We respect your digital footprint. All uploaded files are permanently shredded from our servers after 30 minutes.'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Verified Transparency',
    text: 'We never store, share, or monetize your files or personal information. Your privacy is our business model.'
  }
];

const FAQ_DATA = [
  {
    question: "Is ConverterHub.tech genuinely free to use?",
    answer: "Yes, our core conversion tools are 100% free with no hidden subscriptions. We believe professional-grade document tools should be accessible to everyone, from students to corporate teams."
  },
  {
    question: "Does the conversion process maintain my file formatting?",
    answer: "Absolutely. Our advanced conversion engines are specifically tuned to preserve fonts, layouts, and tables with the highest degree of accuracy possible in cross-format transformation."
  },
  {
    question: "How secure is my data on ConverterHub?",
    answer: "Security is our top priority. We use bank-level encryption and a strict 30-minute auto-deletion policy. Once your session is over, no trace of your data remains on our infrastructure."
  },
  {
    question: "Do I need to install any software or apps?",
    answer: "No. ConverterHub is a cloud-native platform. It works entirely within your web browser on any device, including smartphones, tablets, and desktop computers."
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
              Universal File Conversion, Refined.
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
            The Professional <br className="hidden sm:block" />
            <span className="gradient-text drop-shadow-sm">Toolkit for Files</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`mt-8 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Bridge the gap between digital formats with ConverterHub.tech. Transform PDFs, 
            optimize heavy images, and manage document workflows with cloud-powered precision. 
            No installs, no registries—just industry-leading security and speed.
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
              <span className="relative z-10 text-lg">Start Converting Now</span>
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
                <span>Trusted by 50,000+ users</span>
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

      {/* FAQ Section */}
      <section className={`py-28 ${darkMode ? 'bg-slate-900/20' : 'bg-slate-50/50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-lg`}>Everything you need to know about ConverterHub.</p>
          </div>
          <div className="space-y-6">
            {FAQ_DATA.map((faq, i) => (
              <div 
                key={i}
                className={`p-8 rounded-3xl border ${
                  darkMode 
                    ? 'bg-slate-900/50 border-white/5 hover:border-primary-500/30' 
                    : 'bg-white border-slate-200 shadow-sm hover:border-primary-200'
                } transition-all duration-300`}
              >
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{faq.question}</h3>
                <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{faq.answer}</p>
              </div>
            ))}
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
