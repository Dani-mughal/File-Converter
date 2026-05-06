// v1.1 - Professional UI Update
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ConvertPage from './pages/ConvertPage';

import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import NotFoundPage from './pages/NotFoundPage';
import AdBanner from './components/AdBanner';

export default function App() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative ${
        darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
      }`}
    >
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 grid-background" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </div>

      <Navbar />
      
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full relative">
        {/* Left Sidebar Ad */}
        <aside className="hidden lg:block w-64 shrink-0 p-4 sticky top-24 h-fit">
          <div className="aspect-[4/10] bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-xs text-slate-500 overflow-hidden">
            <AdBanner slot="LEFT_SIDEBAR" format="vertical" />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<div className="pt-48 text-center text-4xl">Privacy Policy</div>} />
            <Route path="/terms" element={<div className="pt-48 text-center text-4xl">Terms of Service</div>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Right Sidebar Ad */}
        <aside className="hidden lg:block w-64 shrink-0 p-4 sticky top-24 h-fit">
          <div className="aspect-[4/10] bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-xs text-slate-500 overflow-hidden">
            <AdBanner slot="RIGHT_SIDEBAR" format="vertical" />
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
