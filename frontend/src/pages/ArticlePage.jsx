import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { BLOG_POSTS } from '../config/blogConfig';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineChevronLeft, HiOutlineShare } from 'react-icons/hi2';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

export default function ArticlePage() {
  const { articleId } = useParams();
  const { darkMode } = useTheme();

  const post = BLOG_POSTS.find(p => p.id === articleId);

  if (!post) return <Navigate to="/blog" />;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const seo = {
    title: `${post.title} | ConverterHub Resources`,
    description: post.summary,
    h1: post.title
  };

  return (
    <div className={`min-h-screen pt-32 pb-24 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <SEO config={seo} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/blog" 
          className={`inline-flex items-center gap-2 text-sm font-bold mb-10 transition-colors ${darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
        >
          <HiOutlineChevronLeft className="w-4 h-4" /> Back to Resources
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="px-5 py-2 bg-primary-600 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg shadow-primary-500/20">
              {post.category}
            </span>
            <div className={`flex items-center gap-4 text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="flex items-center gap-1.5"><HiOutlineCalendar className="w-4 h-4 text-primary-500" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><HiOutlineClock className="w-4 h-4 text-primary-500" /> {post.readTime}</span>
            </div>
          </div>

          <h1 className={`text-4xl sm:text-6xl font-black mb-10 leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {post.title}
          </h1>

          <div className="relative h-[450px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar / Info */}
            <div className="lg:w-1/4 flex flex-col gap-8 order-2 lg:order-1">
              <div className={`p-8 rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <h4 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-4">Author</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">DM</div>
                  <div className="text-sm font-bold">{post.author}</div>
                </div>
              </div>

              <button 
                onClick={handleShare}
                className={`flex items-center justify-center gap-3 p-6 rounded-2xl border font-bold text-sm transition-all ${
                  darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <HiOutlineShare className="w-5 h-5" /> Share Article
              </button>
            </div>

            {/* Content */}
            <div className="lg:w-3/4 order-1 lg:order-2">
              <div 
                className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert' : ''}`}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className={`mt-20 p-10 rounded-[3rem] border ${darkMode ? 'bg-primary-900/10 border-primary-500/20' : 'bg-primary-50 border-primary-100'}`}>
                <h3 className="text-2xl font-bold mb-4">Master your workflow today.</h3>
                <p className={`mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Join thousands of professionals who have transitioned to a secure, cloud-native file management experience with ConverterHub.
                </p>
                <Link to="/convert" className="inline-flex py-4 px-10 gradient-bg text-white font-bold rounded-2xl shadow-xl shadow-primary-500/25 hover:scale-105 transition-all">
                  Start Converting Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
