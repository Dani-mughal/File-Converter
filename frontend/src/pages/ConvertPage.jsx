import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useFileHistory } from '../hooks/useFileHistory';
import { convertFile, getOutputExtension } from '../services/api';
import FileUpload from '../components/FileUpload';
import ConversionSelector from '../components/ConversionSelector';
import ProgressBar from '../components/ProgressBar';
import ResultDownload from '../components/ResultDownload';
import FileHistoryPanel from '../components/FileHistoryPanel';

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

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [conversionType, setConversionType] = useState(searchParams.get('type') || '');
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputFileName, setOutputFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const abortRef = useRef(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleFileSelect = useCallback((selectedFile, error) => {
    setFileError(error);
    setFile(selectedFile);
  }, []);

  const handleFileRemove = useCallback(() => {
    setFile(null);
    setFileError(null);
  }, []);

  const handleConvert = async () => {
    if (!file) {
      toast.error('Please upload a file first.');
      return;
    }
    if (!conversionType) {
      toast.error('Please select a conversion type.');
      return;
    }

    setStep(STEPS.CONVERTING);
    setProgress(0);
    setErrorMessage('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Simulate upload progress (0-50%), then conversion progress (50-100%)
      let currentProgress = 0;
      const uploadInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + 2, 50);
        setProgress(currentProgress);
      }, 100);

      const blob = await convertFile(
        file,
        conversionType,
        (uploadPct) => {
          clearInterval(uploadInterval);
          setProgress(Math.round(uploadPct * 0.5));
        },
        controller.signal
      );

      clearInterval(uploadInterval);

      // Simulate final processing
      for (let p = 50; p <= 100; p += 5) {
        await new Promise((r) => setTimeout(r, 80));
        setProgress(p);
      }

      const ext = getOutputExtension(conversionType);
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const outName = `${baseName}-converted${ext}`;

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputFileName(outName);
      setStep(STEPS.DONE);
      setProgress(100);

      addEntry({
        fileName: file.name,
        fileSize: file.size,
        conversionType,
        status: 'success',
      });

      toast.success('File converted successfully!');
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;

      let msg = 'Conversion failed. Please try again.';
      if (err.response) {
        if (err.response.status === 413) msg = 'File too large for the server.';
        else if (err.response.status === 415) msg = 'Unsupported file format.';
        else if (err.response.status === 500) msg = 'Server error. Please try again later.';
        // Try to read error message from blob
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          if (json.message) msg = json.message;
        } catch {}
      } else if (err.code === 'ERR_NETWORK') {
        msg = 'Cannot connect to server. Make sure the backend is running.';
      }

      setErrorMessage(msg);
      setStep(STEPS.ERROR);
      toast.error(msg);

      addEntry({
        fileName: file.name,
        fileSize: file.size,
        conversionType,
        status: 'error',
      });
    }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setFileError(null);
    setConversionType('');
    setStep(STEPS.UPLOAD);
    setProgress(0);
    setDownloadUrl(null);
    setOutputFileName('');
    setErrorMessage('');
  };

  const canConvert = file && conversionType && step === STEPS.UPLOAD;

  return (
    <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-32 right-1/4 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold">
            Convert Your <span className="gradient-text">Files</span>
          </h1>
          <p className={`mt-3 text-base ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Upload, choose format, and download — it's that easy.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {step === STEPS.UPLOAD && (
              <motion.div
                key="upload-step"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <FileUpload
                  file={file}
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  error={fileError}
                />

                <ConversionSelector
                  selected={conversionType}
                  onSelect={setConversionType}
                  fileType={file?.type}
                />

                <motion.button
                  id="convert-btn"
                  onClick={handleConvert}
                  disabled={!canConvert}
                  whileHover={canConvert ? { scale: 1.02 } : {}}
                  whileTap={canConvert ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                    canConvert
                      ? 'gradient-bg text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
                      : darkMode
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {!file
                    ? 'Upload a file to begin'
                    : !conversionType
                    ? 'Select a conversion type'
                    : 'Convert Now'}
                </motion.button>
              </motion.div>
            )}

            {step === STEPS.CONVERTING && (
              <motion.div
                key="converting-step"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProgressBar progress={progress} status={progress < 100 ? 'converting' : 'done'} />
              </motion.div>
            )}

            {step === STEPS.DONE && (
              <motion.div
                key="done-step"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResultDownload
                  downloadUrl={downloadUrl}
                  fileName={outputFileName}
                  onReset={handleReset}
                />
              </motion.div>
            )}

            {step === STEPS.ERROR && (
              <motion.div
                key="error-step"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className={`rounded-2xl p-8 text-center ${
                    darkMode
                      ? 'bg-slate-800/50 border border-red-500/20'
                      : 'bg-white border border-red-200'
                  }`}
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mb-5">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-red-500 mb-2">Conversion Failed</h3>
                  <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {errorMessage}
                  </p>
                  <button
                    onClick={handleReset}
                    id="try-again-btn"
                    className="inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:shadow-primary-500/40 text-sm cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          {step === STEPS.UPLOAD && (
            <FileHistoryPanel
              history={history}
              onClear={clearHistory}
              onRemove={removeEntry}
            />
          )}
        </div>
      </div>
    </div>
  );
}
