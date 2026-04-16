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
} from 'react-icons/hi2';

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

const CONVERTERS = [
  {
    id: 'pdf-to-word',
    icon: HiOutlineDocumentText,
    label: 'PDF to Word',
    desc: 'Convert PDF to editable DOCX',
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/25',
  },
  {
    id: 'pdf-to-excel',
    icon: HiOutlineTableCells,
    label: 'PDF to Excel',
    desc: 'Extract tables to XLSX',
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/25',
  },
  {
    id: 'image-to-pdf',
    icon: HiOutlinePhoto,
    label: 'Image to PDF',
    desc: 'JPG, PNG, WebP to PDF',
    gradient: 'from-purple-500 to-pink-600',
    shadow: 'shadow-purple-500/25',
  },
];

export default function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float-delay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase ${
                darkMode
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : 'bg-primary-50 text-primary-600 border border-primary-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Free & Unlimited Conversions
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Convert Your Files{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text">In Seconds</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Transform PDFs, images, and documents effortlessly.
            Fast, secure, and beautifully simple.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/convert"
              id="hero-cta"
              className="inline-flex items-center gap-2.5 px-8 py-4 gradient-bg text-white font-semibold rounded-xl shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5 text-sm"
            >
              Start Converting
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              No signup required
            </span>
          </motion.div>
        </div>
      </section>

      {/* Converter Cards */}
      <section className={`py-20 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Popular Conversions
            </h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Choose your conversion type and get started instantly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONVERTERS.map((conv, i) => {
              const Icon = conv.icon;
              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={`/convert?type=${conv.id}`}
                    id={`home-card-${conv.id}`}
                    className={`group block p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                      darkMode
                        ? 'bg-slate-800/60 border border-slate-700/50 hover:border-slate-600'
                        : 'bg-white border border-slate-200 hover:shadow-xl hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${conv.gradient} flex items-center justify-center mb-5 shadow-lg ${conv.shadow} group-hover:shadow-xl transition-shadow`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {conv.label}
                    </h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {conv.desc}
                    </p>
                    <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium ${
                      darkMode ? 'text-primary-400' : 'text-primary-600'
                    } group-hover:gap-2.5 transition-all`}>
                      Convert Now
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Why ConvertHub?
            </h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Built for speed, security, and simplicity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className={`text-center p-8 rounded-2xl transition-all ${
                    darkMode
                      ? 'bg-slate-800/30 border border-slate-700/30'
                      : 'bg-white border border-slate-100'
                  }`}
                >
                  <div
                    className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                      darkMode ? f.bgDark : f.bgLight
                    } ${f.textColor}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`py-20 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50/80'}`}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Ready to Convert?
            </h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Upload your file and get your converted document in seconds.
            </p>
            <Link
              to="/convert"
              id="bottom-cta"
              className="inline-flex items-center gap-2.5 px-8 py-4 gradient-bg text-white font-semibold rounded-xl shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
