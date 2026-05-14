import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import { 
  HiOutlineEnvelope, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineMapPin,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi2';

export default function ContactPage() {
  const { darkMode } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = e.target;
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: ''
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
            } relative overflow-hidden`}
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-3">Your Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
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
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-primary-500 transition-all ${
                          darkMode ? 'border-white/10' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-3">Subject</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-primary-500 transition-all ${
                        darkMode ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'
                      }`}
                    >
                      <option className={darkMode ? 'bg-slate-900' : 'bg-white'}>General Inquiry</option>
                      <option className={darkMode ? 'bg-slate-900' : 'bg-white'}>Technical Support</option>
                      <option className={darkMode ? 'bg-slate-900' : 'bg-white'}>Billing Question</option>
                      <option className={darkMode ? 'bg-slate-900' : 'bg-white'}>Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-3">Message</label>
                    <textarea 
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="How can we help you?"
                      className={`w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-primary-500 transition-all ${
                        darkMode ? 'border-white/10' : 'border-slate-200'
                      }`}
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-5 gradient-bg text-white font-black rounded-2xl shadow-xl shadow-primary-500/25 transition-all hover:shadow-primary-500/40 active:scale-[0.98] flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-black mb-4">Message Sent!</h2>
                  <p className={`text-lg mb-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Thank you for reaching out. Our team will get back to you at {formData.email} within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="px-10 py-4 bg-primary-500/10 text-primary-500 font-bold rounded-2xl hover:bg-primary-500/20 transition-all"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
