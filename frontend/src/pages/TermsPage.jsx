import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function TermsPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary-500">Terms of Service</h1>
        
        <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} shadow-xl`}>
          <p className="mb-6 text-lg leading-relaxed">
            These terms and conditions outline the rules and regulations for the use of ConverterHub's Website and Services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">1. Acceptance of Terms</h2>
          <p className="mb-4 text-lg leading-relaxed">
            By accessing this website we assume you accept these terms and conditions. Do not continue to use ConverterHub if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">2. Description of Service</h2>
          <p className="mb-4 text-lg leading-relaxed">
            ConverterHub provides online file conversion services. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without notice.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">3. User Responsibilities</h2>
          <p className="mb-4 text-lg leading-relaxed">
            You agree to use the service only for lawful purposes. You are solely responsible for the content of the files you upload and convert using our service. You must not use our service to convert files that contain illegal content, malware, or infringe on the intellectual property rights of others.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">4. Privacy and File Handling</h2>
          <p className="mb-4 text-lg leading-relaxed">
            We respect your privacy. Uploaded files are processed temporarily for the purpose of conversion and are automatically deleted from our servers shortly after. We do not claim any ownership rights over your files.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">5. Limitation of Liability</h2>
          <p className="mb-4 text-lg leading-relaxed">
            In no event shall ConverterHub, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website. ConverterHub shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.
          </p>
        </div>
      </div>
    </div>
  );
}
