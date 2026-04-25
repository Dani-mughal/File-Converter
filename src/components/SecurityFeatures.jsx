import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineShieldCheck, 
  HiOutlineLockClosed, 
  HiOutlineEyeSlash,
  HiOutlineTrash,
  HiOutlineInformationCircle,
  HiOutlineCheckBadge
} from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';

const SECURITY_ITEMS = [
  {
    icon: HiOutlineLockClosed,
    title: 'SSL Encryption',
    description: 'Every byte of data sent to our servers is protected with 256-bit SSL encryption.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    icon: HiOutlineEyeSlash,
    title: 'Privacy Guaranteed',
    description: "Our automated process means no human will ever see your files. Total anonymity.",
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    icon: HiOutlineTrash,
    title: 'Automatic Deletion',
    description: 'We store files temporarily. Everything is permanently wiped from our cloud after 24 hours.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'GDPR Compliant',
    description: 'We follow strict data protection regulations to ensure your rights are respected.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  }
];

export default function SecurityFeatures() {
  const { darkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`py-12 px-6 sm:px-10 rounded-[2.5rem] transition-all duration-500 ${
      darkMode ? 'bg-slate-900/40 border border-white/5' : 'bg-white border border-slate-100 shadow-2xl shadow-slate-200/40'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <HiOutlineCheckBadge className="w-4 h-4" />
            Military-Grade Security
          </motion.div>
          <h2 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Your Data is Safe with Us
          </h2>
          <p className={`text-sm max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We understand the importance of your file security. Our platform is built on 
            a foundation of trust and technical excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SECURITY_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex gap-5 p-6 rounded-2xl transition-all group ${
                darkMode ? 'hover:bg-white/5' : 'hover:bg-primary-50/50'
              }`}
            >
              <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.bg} ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-bold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
            }`}
          >
            <HiOutlineInformationCircle className="w-4 h-4" />
            {isExpanded ? 'Hide Details' : 'View Full Security Protocol'}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`mt-8 p-8 rounded-3xl border border-dashed ${
                darkMode ? 'border-white/10 bg-white/5' : 'border-primary-200 bg-primary-50/30'
              }`}>
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <HiOutlineCheckBadge className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Verified Security Protocol</p>
                    </div>
                    <p className={`text-xs leading-relaxed max-w-md ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Our servers are audited regularly to maintain the highest standards of data integrity. 
                      We use specialized ephemeral environments for conversion, meaning your data never 
                      touches a permanent storage disk.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="px-5 py-3 bg-slate-800 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg">PCI-DSS</div>
                    <div className="px-5 py-3 bg-slate-800 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg">ISO 27001</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
