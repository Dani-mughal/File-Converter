import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary-500">Privacy Policy</h1>
        
        <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} shadow-xl`}>
          <p className="mb-6 text-lg leading-relaxed">
            Welcome to ConverterHub. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">1. Important Information and Who We Are</h2>
          <p className="mb-4 text-lg leading-relaxed">
            Our platform provides file conversion services. To provide these services, we process the files you upload. We do not store your files longer than necessary to complete the conversion and allow you to download the result.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">2. The Data We Collect About You</h2>
          <p className="mb-4 text-lg leading-relaxed">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">3. How We Use Your Data</h2>
          <p className="mb-4 text-lg leading-relaxed">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
            <li>To provide the file conversion services you request.</li>
            <li>To improve our website, products/services, marketing, customer relationships, and experiences.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">4. File Retention Policy</h2>
          <p className="mb-4 text-lg leading-relaxed">
            Files uploaded to our servers for conversion are kept temporarily and are automatically deleted after the conversion process is complete and a short download window has expired. We do not inspect, copy, or share your files.
          </p>
        </div>
      </div>
    </div>
  );
}
