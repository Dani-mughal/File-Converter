import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineLockClosed } from 'react-icons/hi2';

export default function PrivacyPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-32 pb-24 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-500 rounded-3xl mb-6">
            <HiOutlineLockClosed className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6">Privacy Policy</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-lg`}>
            Your security is our priority. Learn how we protect your information.
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
            <h2 className="text-2xl font-bold mb-4 text-primary-500">1. Introduction</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              ConverterHub.tech ("we," "our," or "us") is deeply committed to protecting your personal data and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and utilize our cloud-based file transformation tools. We treat every document with the highest level of enterprise-grade security and transparency.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">2. Information We Do Not Collect</h2>
            <p className="mb-4 text-lg">Unlike generic utilities, we prioritize a "stateless" architecture:</p>
            <ul className={`list-disc pl-6 space-y-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <li><strong>No Personal Identifiers:</strong> We do not require account registration, email addresses, or payment information for our core services.</li>
              <li><strong>No Data Monetization:</strong> We do not sell, rent, or trade your files or personal information to third parties. Your privacy is not our product.</li>
              <li><strong>No Document Storage:</strong> We do not keep logs, backups, or cached copies of your converted files once the session is purged.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">3. Zero-Retention & Auto-Deletion</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              We implement a strict zero-retention protocol. Every file uploaded for conversion is held in an isolated, temporary memory container and is automatically and permanently purged from our global server network within <strong>30 minutes</strong> of completion. This process is fully automated and irreversible, ensuring your sensitive data remains entirely your own.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">4. Encryption & Security Standards</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              All file transfers are protected by 256-bit SSL (Secure Sockets Layer) encryption, the same standard used by global financial institutions. This ensures that the communication path between your browser and our cloud engine is secure from unauthorized interception or tampering.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">5. Google AdSense & Cookies</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              We use Google AdSense to serve advertisements on our site. Google uses cookies to serve ads based on a user's prior visits to our website or other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary-500 underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>. We also use minimal first-party cookies to ensure session stability and tool functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary-500">6. Compliance (GDPR/CCPA)</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
              We comply with global data protection standards, including GDPR and CCPA. Since we do not store permanent personal data or require user accounts, your "right to be forgotten" is intrinsic to our system—your data is deleted automatically without action required from you.
            </p>
          </section>

          <div className={`p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 ${darkMode ? 'text-primary-400' : 'text-primary-600'} text-center italic`}>
            For detailed privacy inquiries, please contact our Data Protection Officer at: <span className="font-bold">support@converterhub.tech</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
