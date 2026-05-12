import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useFileHistory } from '../hooks/useFileHistory';
import { uploadFile, startConversion, getJobStatus, downloadJobResult, getOutputExtension } from '../services/api';
import { getSeoConfig } from '../config/seoConfig';
import FileUpload from '../components/FileUpload';
import ConversionSelector from '../components/ConversionSelector';
import ProgressBar from '../components/ProgressBar';
import ResultDownload from '../components/ResultDownload';
import FileHistoryPanel from '../components/FileHistoryPanel';
import SecurityFeatures from '../components/SecurityFeatures';
import { getRelatedTools } from '../config/toolsConfig';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import AdBanner from '../components/AdBanner';
import { HiOutlineQuestionMarkCircle, HiOutlineListBullet } from 'react-icons/hi2';

const STEPS = {
  UPLOAD: 'upload',
  CONVERTING: 'converting',
  DONE: 'done',
  ERROR: 'error',
};

export default function ConvertPage() {
  const { darkMode } = useTheme();
  const { toolId } = useParams();
  const [searchParams] = useSearchParams();
  const { history, addEntry, clearHistory, removeEntry } = useFileHistory();

  // SEO Config
  const currentToolId = toolId || searchParams.get('type') || '';
  const seo = getSeoConfig(currentToolId);

  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [conversionType, setConversionType] = useState(currentToolId);
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputFileName, setOutputFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pollIntervalRef = useRef(null);

  // Synchronize conversionType with URL toolId
  useEffect(() => {
    if (toolId) {
      setConversionType(toolId);
    }
  }, [toolId]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [downloadUrl]);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file.');
      return;
    }
    if (!conversionType) {
      toast.error('Please select a conversion type.');
      return;
    }

    setStep(STEPS.CONVERTING);
    setProgress(0);
    setErrorMessage('');

    try {
      const file = files[0];
      const uploadRes = await uploadFile(file, (pct) => setProgress(Math.round(pct * 0.3)));

      const targetFormat = conversionType.includes('-to-') ? conversionType.split('-to-')[1] : conversionType;
      const jobId = await startConversion(uploadRes.filePath, targetFormat, file.name);
      
      setProgress(40);

      pollIntervalRef.current = setInterval(async () => {
        try {
          const status = await getJobStatus(jobId);
          if (status.state === 2) {
            clearInterval(pollIntervalRef.current);
            setProgress(90);
            
            const blob = await downloadJobResult(jobId);
            const url = URL.createObjectURL(blob);
            
            const ext = getOutputExtension(targetFormat);
            const outName = `${file.name.replace(/\.[^.]+$/, '')}-converted${ext}`;
            
            setDownloadUrl(url);
            setOutputFileName(outName);
            setStep(STEPS.DONE);
            setProgress(100);
            toast.success('Conversion successful!');
            
            addEntry({
              fileName: file.name,
              fileSize: file.size,
              conversionType,
              status: 'success',
            });
          } else if (status.state === 3) {
            throw new Error(status.errorMessage || 'Conversion failed.');
          } else {
            setProgress(40 + (status.progress * 0.5));
          }
        } catch (err) {
          clearInterval(pollIntervalRef.current);
          handleError(err);
        }
      }, 1000);

    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    const msg = err.message || 'Conversion failed. Please try again.';
    setErrorMessage(msg);
    setStep(STEPS.ERROR);
    toast.error(msg);
    addEntry({
      fileName: files[0]?.name || 'Unknown',
      fileSize: files[0]?.size || 0,
      conversionType,
      status: 'error',
    });
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setFileError(null);
    setStep(STEPS.UPLOAD);
    setProgress(0);
    setDownloadUrl(null);
    setOutputFileName('');
    setErrorMessage('');
  };

  const canConvert = files.length > 0 && conversionType && step === STEPS.UPLOAD;

  // JSON-LD Schema for rich snippets
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": seo.h1,
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    ...(seo.faq && {
      "mainEntity": seo.faq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    })
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Hero / Tool Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{seo.h1.split(' ')[0]} <span className="gradient-text">{seo.h1.split(' ').slice(1).join(' ')}</span></h1>
            <p className={`mt-4 text-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Fast, secure, and entirely online. No installation required.</p>
          </motion.div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {step === STEPS.UPLOAD && (
                <motion.div key="upload-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <FileUpload files={files} onFilesChange={setFiles} error={fileError} onError={setFileError} />
                  <ConversionSelector selected={conversionType} onSelect={setConversionType} files={files} />
                  <button
                    onClick={handleConvert}
                    disabled={!canConvert}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      canConvert ? 'gradient-bg text-white shadow-xl hover:scale-[1.01]' : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {files.length === 0 ? 'Upload files to begin' : !conversionType ? 'Select a format' : 'Convert Now'}
                  </button>
                  <SecurityFeatures />
                </motion.div>
              )}

              {step === STEPS.CONVERTING && (
                <motion.div key="converting-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ProgressBar progress={progress} status={progress < 100 ? 'converting' : 'done'} />
                </motion.div>
              )}

              {step === STEPS.DONE && (
                <motion.div key="done-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ResultDownload downloadUrl={downloadUrl} fileName={outputFileName} onReset={handleReset} />
                </motion.div>
              )}

              {step === STEPS.ERROR && (
                <motion.div key="error-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className={`rounded-3xl p-10 text-center border ${darkMode ? 'bg-slate-900 border-red-500/20' : 'bg-white border-red-100'}`}>
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Conversion Failed</h3>
                    <p className="text-slate-500 mb-8">{errorMessage}</p>
                    <button onClick={handleReset} className="px-8 py-3 gradient-bg text-white font-bold rounded-xl shadow-lg">Try Again</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step === STEPS.UPLOAD && <FileHistoryPanel history={history} onClear={clearHistory} onRemove={removeEntry} />}
          </div>
        </div>

        {/* SEO Content Machine Sections */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-200 dark:border-slate-800 pt-16">
          {/* Instructions / Steps */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
                <HiOutlineListBullet className="w-6 h-6" />
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{seo.h2}</h2>
            </div>
            <ul className="space-y-4">
              {seo.steps?.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    {i + 1}
                  </span>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQs */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                <HiOutlineQuestionMarkCircle className="w-6 h-6" />
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              {seo.faq?.map((item, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.q}</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Security / Trust Sidebar (Visual for AI Search) */}
        <div className={`mt-16 p-8 rounded-[2.5rem] border ${darkMode ? 'bg-slate-900/30 border-white/5' : 'bg-slate-50 border-slate-200'} text-center`}>
          <h2 className="text-xl font-bold mb-4">Secure & Private Conversions</h2>
          <p className={`text-sm max-w-2xl mx-auto ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            All file transfers are protected by 256-bit SSL encryption. We do not store your files permanently; 
            everything is automatically deleted 30 minutes after conversion to ensure your privacy.
          </p>
        </div>

        {/* Related Tools Section */}
        <div className="mt-24 border-t border-slate-200 dark:border-slate-800 pt-16">
          <h2 className={`text-3xl font-black mb-10 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Explore More Conversion Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRelatedTools(currentToolId).map((tool) => (
              <Link
                key={tool.id}
                to={`/${tool.id}`}
                className={`group p-8 rounded-[2rem] border transition-all duration-300 flex items-center justify-between ${
                  darkMode 
                    ? 'bg-slate-900/40 border-white/5 hover:border-primary-500/30 hover:bg-slate-900/60' 
                    : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-xl'
                }`}
              >
                <div>
                  <h3 className={`font-bold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {tool.label}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Free online conversion
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  darkMode ? 'bg-white/5 text-slate-400 group-hover:text-primary-400' : 'bg-slate-50 text-slate-400 group-hover:text-primary-600'
                }`}>
                  <HiOutlineArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
