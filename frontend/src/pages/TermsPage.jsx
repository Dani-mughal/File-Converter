import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineDocumentText } from 'react-icons/hi2';

export default function TermsPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-32 pb-24 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary-500/10 text-primary-500 rounded-3xl mb-6">
            <HiOutlineDocumentText className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6">Terms of Service</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-lg`}>
            The legal framework for using our universal conversion platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-10 rounded-[2.5rem] border ${
            darkMode ? 'bg-slate-900/50 border-white/10' : 'bg-slate-50 border-slate-200'
          } leading-relaxed space-y-8`}
        >
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">1. Agreement to Terms</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              By accessing and using ConverterHub.tech, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and ConverterHub.tech regarding your use of our file transformation workstation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">2. Description of Service</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              ConverterHub.tech provides a comprehensive, automated web-based utility for file conversion and processing. Our services are provided via a cloud-native engine. We reserve the right to modify, suspend, or terminate services (including limiting file sizes or concurrent conversions) at any time to ensure the stability and security of our global infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">3. Acceptable Use Policy</h2>
            <p className="mb-4">Users are strictly prohibited from utilizing our service to:</p>
            <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>Upload or process files containing malware, viruses, or any form of malicious code.</li>
              <li>Transform content that infringes upon the intellectual property, copyright, or trademark rights of third parties.</li>
              <li>Engagement in scraper "botting" or unauthorized automated access to our conversion APIs.</li>
              <li>Any activity intended to disrupt or degrade the experience for other users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">4. Intellectual Property Rights</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              We do not claim ownership of any files you upload. You retain all original rights to your content. By using our service, you grant us a limited, temporary license to process and transform your files solely for the purpose of delivering the requested output. All original files and their outputs are purged according to our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">5. Limitation of Liability</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              ConverterHub.tech is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, we shall not be liable for any direct, indirect, or incidental damages resulting from the use or inability to use our tools, including but not limited to data loss or formatting inaccuracies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">6. Modifications</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              We may revise these terms at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.
            </p>
          </section>

          <div className={`p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 ${darkMode ? 'text-primary-400' : 'text-primary-600'} text-center italic`}>
            Last Revision: May 2024. For legal inquiries, please contact: <span className="font-bold">legal@converterhub.tech</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
