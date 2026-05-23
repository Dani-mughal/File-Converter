import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineScale } from 'react-icons/hi2';

export default function DmcaPolicy() {
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
            <HiOutlineScale className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6">DMCA Policy</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-lg`}>
            Intellectual Property Rights and Content Removal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-10 rounded-[2.5rem] border ${
            darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'
          } leading-relaxed space-y-8`}
        >
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              ConverterHub.tech respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement committed using our service. We take intellectual property rights seriously and maintain strict policies to address any reported violations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Nature of Transient Data</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              ConverterHub is a transient utility service. We do not store files longer than required for the automated conversion process (automatically shredded after 30 minutes). As such, we typically do not have persistent content to "take down" from our servers once a conversion session expires. However, we will investigate any claim that our tools or site infrastructure are being used for infringing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Filing a Notice of Infringement</h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
              If you are a copyright owner and believe your work is being utilized in a way that constitutes infringement via ConverterHub.tech, please provide a written notice to our DMCA Agent containing the following elements:
            </p>
            <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
              <li>Detailed identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material or tool on our site that is claimed to be infringing.</li>
              <li>Your complete contact information, including physical address and email.</li>
              <li>A statement of good faith belief that the contested use is not authorized by the copyright owner.</li>
              <li>A statement that the information provided is accurate and, under penalty of perjury, you are the authorized party to act.</li>
            </ul>
          </section>

          <div className={`p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 ${darkMode ? 'text-primary-400' : 'text-primary-600'} text-center italic`}>
            Submit your DMCA notices to our legal desk: <span className="font-bold">dmca@converterhub.tech</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
