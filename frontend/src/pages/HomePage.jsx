import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineDocumentText,
  HiOutlineTableCells,
  HiOutlinePhoto,
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineCloud,
  HiOutlineLockClosed,
  HiOutlineArrowPathRoundedSquare
} from 'react-icons/hi2';
import ConversionGrid from '../components/ConversionGrid';

const FEATURES = [
  {
    icon: HiOutlineBolt,
    title: 'Lightning Fast',
    description: 'Convert files in seconds with our optimized processing engine.',
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-500/10',
    textColor: 'text-amber-500',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure & Private',
    description: 'Your files are encrypted and automatically deleted after conversion.',
    color: 'from-emerald-400 to-teal-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
  },
  {
    icon: HiOutlineCloud,
    title: 'Cloud Powered',
    description: 'No software to install. Convert directly from your browser.',
    color: 'from-sky-400 to-blue-500',
    bgLight: 'bg-sky-50',
    bgDark: 'bg-sky-500/10',
    textColor: 'text-sky-500',
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
    text: 'We respect your data. All uploaded files are permanently deleted from our servers after 24 hours.'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Zero Data Selling',
    text: 'We never store, share, or sell your files or personal information to third parties.'
  }
];

export default function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-48 sm:pb-36">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${darkMode ? 'bg-[radial-gradient(circle_at_top_right,#4f46e5_0%,transparent_50%)]' : 'bg-[radial-gradient(circle_at_top_right,#e0e7ff_0%,transparent_50%)]'}`} />
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
              Trusted by 1M+ Users Monthly
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
            The Ultimate <br className="hidden sm:block" />
            <span className="gradient-text drop-shadow-sm">File Transformer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`mt-8 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Switch between formats instantly. Secure, fast, and 100% free. 
            No software installation required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
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
            <div className="flex flex-col items-start gap-1">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 ${darkMode ? 'border-slate-900' : 'border-white'} bg-slate-200 overflow-hidden`}>
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <span className={`text-sm font-semibold ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Joined by 10k+ today
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

      {/* Conversion Grid Component */}
      <ConversionGrid />

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
              Why Choose Our Platform?
            </h2>
            <p className={`mt-4 text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Built with cutting-edge technology to give you the best experience possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
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
              Join millions of users who trust ConvertHub for their daily file processing needs. No credit card required.
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
    </div>
  );
}
