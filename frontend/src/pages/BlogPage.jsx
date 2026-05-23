import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { BLOG_POSTS } from '../config/blogConfig';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineChevronRight } from 'react-icons/hi2';
import SEO from '../components/SEO';

export default function BlogPage() {
  const { darkMode } = useTheme();

  const seo = {
    title: 'Resource Hub | Guides, Tutorials & File Management Tips - ConverterHub',
    description: 'Explore our comprehensive guides on file conversion, document security, and digital productivity. Become an expert in file management with ConverterHub.',
    h1: 'The Resource Hub'
  };

  return (
    <div className={`min-h-screen pt-32 pb-24 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <SEO config={seo} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl sm:text-7xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            Insights & <span className="gradient-text">Guides</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Expert advice on file optimization, security, and digital workflow management.
          </motion.p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-500 border ${
                darkMode 
                  ? 'bg-slate-900 border-white/5 hover:border-primary-500/30 hover:bg-slate-900/60 shadow-2xl shadow-black/20' 
                  : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-2xl shadow-xl shadow-slate-200/50'
              }`}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-full shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className={`flex items-center gap-4 text-xs font-medium mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span className="flex items-center gap-1.5"><HiOutlineCalendar className="w-4 h-4" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><HiOutlineClock className="w-4 h-4" /> {post.readTime}</span>
                </div>
                
                <h2 className={`text-2xl font-bold mb-4 leading-tight group-hover:text-primary-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                
                <p className={`text-sm leading-relaxed mb-8 flex-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {post.summary}
                </p>
                
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-primary-500 font-bold text-sm tracking-wide group-hover:translate-x-1 transition-transform"
                >
                  Read Full Article <HiOutlineChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
