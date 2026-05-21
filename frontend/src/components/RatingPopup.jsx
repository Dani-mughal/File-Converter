import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from './AnalyticsTracker';

export default function RatingPopup({ conversionType, onClose }) {
  const { darkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    // Track Analytics
    trackEvent('rating_given', { score: rating, type: conversionType });
    if (feedback) {
      trackEvent('review_submitted', { type: conversionType, has_feedback: true });
    }

    try {
      // Send to backend
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${baseUrl}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: rating, feedback, conversionType })
      });
    } catch (err) {
      console.error('Failed to submit rating', err);
    }

    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`fixed bottom-6 right-6 p-6 rounded-2xl shadow-2xl z-50 w-80 ${darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
      >
        {!submitted ? (
          <>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
            <h3 className="font-bold text-lg mb-2">Rate your experience</h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>How was your {conversionType || 'conversion'}?</p>
            
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${star <= (hoveredRating || rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Optional feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={`w-full p-3 rounded-xl text-sm mb-4 resize-none h-20 ${darkMode ? 'bg-slate-800 border-none placeholder:text-slate-500 focus:ring-primary-500' : 'bg-slate-50 border-slate-200 focus:ring-primary-500'}`}
            />
            
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`w-full py-2.5 rounded-xl font-bold transition-all ${rating > 0 ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              Submit Review
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-emerald-500 text-4xl mb-2">✓</div>
            <h3 className="font-bold text-lg">Thank You!</h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your feedback helps us improve.</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
