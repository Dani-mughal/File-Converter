import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useFileHistory } from '../hooks/useFileHistory';
import { uploadFile, startConversion, getJobStatus, downloadJobResult, getOutputExtension } from '../services/api';
import FileUpload from '../components/FileUpload';
import ConversionSelector from '../components/ConversionSelector';
import ProgressBar from '../components/ProgressBar';
import ResultDownload from '../components/ResultDownload';
import FileHistoryPanel from '../components/FileHistoryPanel';
import SecurityFeatures from '../components/SecurityFeatures';
import AdBanner from '../components/AdBanner';

const STEPS = {
  UPLOAD: 'upload',
  CONVERTING: 'converting',
  DONE: 'done',
  ERROR: 'error',
};

export default function ConvertPage() {
  const { darkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const { history, addEntry, clearHistory, removeEntry } = useFileHistory();

  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [conversionType, setConversionType] = useState(searchParams.get('type') || '');
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputFileName, setOutputFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pollIntervalRef = useRef(null);

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
      // Step 1: Upload (taking the first file for now in this demo, multi-file would loop)
      const file = files[0];
      const uploadRes = await uploadFile(file, (pct) => setProgress(Math.round(pct * 0.3)));

      // Step 2: Start Job
      const targetFormat = conversionType.includes('-to-') ? conversionType.split('-to-')[1] : conversionType;
      const jobId = await startConversion(uploadRes.filePath, targetFormat, file.name);
      
      setProgress(40);

      // Step 3: Poll Status
      pollIntervalRef.current = setInterval(async () => {
        try {
          const status = await getJobStatus(jobId);
          if (status.state === 2) { // Completed
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
          } else if (status.state === 3) { // Failed
            throw new Error(status.errorMessage || 'Conversion failed.');
          } else {
            // Processing
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

  return (
    <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold">Convert Your <span className="gradient-text">Files</span></h1>
          <p className={`mt-3 text-base ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Fast, secure, and entirely online.</p>
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
    </div>
  );
}
