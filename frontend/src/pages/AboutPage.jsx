import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  HiOutlineGlobeAlt, 
  HiOutlineShieldCheck, 
  HiOutlineBolt, 
  HiOutlineUserGroup 
} from 'react-icons/hi2';
import { 
  FaGithub, 
  FaLinkedin, 
  FaFacebook 
} from 'react-icons/fa';

const VALUES = [
  {
    icon: HiOutlineBolt,
    title: 'Speed First',
    text: 'We leverage global edge servers to ensure your files are processed in the blink of an eye.'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Privacy Guaranteed',
    text: 'Your data is yours. We use bank-grade encryption and automatic deletion protocols.'
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Universal Access',
    text: 'Supporting 1000+ file combinations across every major platform and device.'
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Distributed by',
    text: 'Proudly managed and distributed by Dani Mughal, dedicated to creating premium web tools.'
  }
];

export default function AboutPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-32 pb-24 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-500 font-bold tracking-wider uppercase text-sm mb-4 block">Our Mission</span>
            <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-tight">
              Simplifying <span className="gradient-text">File Freedom</span> for Everyone.
            </h1>
            <p className={`text-xl leading-relaxed mb-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              ConvertHub was founded on a simple premise: file formats should never stand in the way of productivity. 
              We've built the world's most versatile cloud conversion engine to help millions of users bridge the gap 
              between different digital worlds.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="text-center p-6 rounded-3xl bg-primary-500/10 border border-primary-500/20">
                <div className="text-3xl font-black text-primary-500">10M+</div>
                <div className="text-sm font-semibold opacity-60">Files Converted</div>
              </div>
              <div className="text-center p-6 rounded-3xl bg-primary-500/10 border border-primary-500/20">
                <div className="text-3xl font-black text-primary-500">1M+</div>
                <div className="text-sm font-semibold opacity-60">Happy Users</div>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="https://github.com/Dani-mughal" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-slate-900 text-white hover:scale-110 transition-all shadow-lg"><FaGithub className="w-6 h-6" /></a>
              <a href="https://www.linkedin.com/in/muhammad-adnan-arif-7b5a65320/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-[#0077b5] text-white hover:scale-110 transition-all shadow-lg"><FaLinkedin className="w-6 h-6" /></a>
              <a href="https://www.facebook.com/muhammadadnan.arif.923" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-[#1877f2] text-white hover:scale-110 transition-all shadow-lg"><FaFacebook className="w-6 h-6" /></a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
              alt="Team collaboration" 
              className="relative rounded-[3rem] shadow-2xl border border-white/10"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">What We Stand For</h2>
            <p className={`max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Our core values guide every line of code we write and every feature we ship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2.5rem] border transition-all ${
                  darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl'
                }`}
              >
                <div className="w-14 h-14 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mb-6">
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{val.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
