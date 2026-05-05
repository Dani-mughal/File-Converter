// v1.1 - Professional UI Update
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ConvertPage from './pages/ConvertPage';
import NotFoundPage from './pages/NotFoundPage';

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
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
