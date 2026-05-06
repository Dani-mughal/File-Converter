import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  HiOutlineEnvelope, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineMapPin,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi2';

export default function ContactPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-32 pb-24 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-tight">
              Get in <span className="gradient-text">Touch</span>.
            </h1>
            <p className={`text-xl mb-12 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Have questions or need technical assistance? Our team is here to help 24/7. 
              Fill out the form or reach out via our direct channels.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center shrink-0">
                  <HiOutlineEnvelope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Support</h3>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>adnanmughal3153@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Phone Number</h3>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>03118980949</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-10 rounded-[3rem] border ${
              darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className={`w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-primary-500 transition-all ${
                      darkMode ? 'border-white/10' : 'border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className={`w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-primary-500 transition-all ${
                      darkMode ? 'border-white/10' : 'border-slate-200'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-3">Subject</label>
                <select className={`w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-primary-500 transition-all ${
                  darkMode ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing Question</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-3">Message</label>
                <textarea 
                  rows={5}
                  placeholder="How can we help you?"
                  className={`w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-primary-500 transition-all ${
                    darkMode ? 'border-white/10' : 'border-slate-200'
                  }`}
                ></textarea>
              </div>
              <button className="w-full py-5 gradient-bg text-white font-black rounded-2xl shadow-xl shadow-primary-500/25 transition-all hover:shadow-primary-500/40 active:scale-[0.98]">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
