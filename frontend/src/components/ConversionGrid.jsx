import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  HiOutlineVideoCamera, 
  HiOutlinePhoto, 
  HiOutlineDocumentText, 
  HiOutlineGif, 
  HiOutlineSquares2X2,
  HiChevronRight,
  HiOutlineArchiveBox,
  HiOutlineBookOpen,
  HiOutlineCodeBracket,
  HiOutlineCube,
  HiOutlineWrenchScrewdriver
} from 'react-icons/hi2';

import { CATEGORIES } from '../config/toolsConfig';

const ALL_CATEGORIES = [
  {
    id: 'all',
    title: 'All Tools',
    icon: HiOutlineSquares2X2,
  },
  ...CATEGORIES
];

export default function ConversionGrid({ externalSearch = '' }) {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [internalSearch, setInternalSearch] = useState('');

  // Use external search if provided (from hero), otherwise internal
  const searchQuery = externalSearch || internalSearch;

  const filteredCategories = useMemo(() => {
    let result = activeTab === 'all' 
      ? CATEGORIES.filter(c => c.id !== 'all') 
      : CATEGORIES.filter(c => c.id === activeTab);

    if (searchQuery) {
      result = result.map(cat => ({
        ...cat,
        links: cat.links?.filter(l => 
          l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.links && cat.links.length > 0);
    }

    return result;
  }, [activeTab, searchQuery]);

  return (
    <section id="conversions" className={`py-24 relative overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            Universal File Conversion
          </motion.h2>
          
          {/* Tabs / Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  activeTab === cat.id
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20'
                    : darkMode 
                      ? 'bg-slate-900 text-slate-400 border border-white/5 hover:bg-slate-800' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <cat.icon className="w-5 h-5" />
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`group flex flex-col rounded-[2rem] p-8 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-slate-900/60 border border-slate-800/50 backdrop-blur-sm shadow-xl shadow-black/20' 
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-8 pb-5 border-b border-slate-200/50 dark:border-slate-800/50">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${cat.bg} ${cat.color}`}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {cat.title}
                  </h3>
                </div>

                <ul className="space-y-4 flex-1">
                  {cat.links.map((link) => (
                    <li key={link.id}>
                      <Link 
                        to={`/${link.id}`} 
                        className={`group/link flex items-center justify-between text-[15px] font-semibold transition-colors ${
                          darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <span>{link.label}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all ${darkMode ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                           <HiChevronRight className="w-4 h-4 text-primary-500" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-500">No conversion tools found for your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
