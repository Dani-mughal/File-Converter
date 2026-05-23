import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

export default function Disclaimer() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-32 pb-24 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 text-amber-500 rounded-3xl mb-6">
            <HiOutlineExclamationTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6">Disclaimer</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-lg`}>
            Please read this legal notice carefully before using our services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-10 rounded-[2.5rem] border ${
            darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'
          } leading-relaxed space-y-8`}
        >
          <section>
            <h2 className="text-2xl font-bold mb-4">General Information</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              The information and tools provided on ConverterHub.tech are for general informational and utility purposes only. All tools are provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any conversion result or information on the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Use at Your Own Risk</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Your use of our conversion tools is entirely at your own risk. ConverterHub.tech and its developers shall not be held liable for any loss of data, corrupted files, security breaches, or any other damages resulting from the use of our services. We strongly recommend maintaining a local backup of any original document before utilizing our cloud transformation tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">No Professional Advice</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              The service cannot and does not contain professional legal or documentation advice. The use or reliance of any information contained on this site is solely at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">External Links</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Our website may contain links to external sites that are not operated or controlled by us. We accept no responsibility or liability for the content, privacy policies, or practices of any third-party websites or services linked to from ConverterHub.tech.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
