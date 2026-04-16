import { useState, useEffect } from 'react';

const STORAGE_KEY = 'converthub-history';
const MAX_HISTORY = 20;

/**
 * Custom hook to persist file conversion history in localStorage.
 */
export function useFileHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = (entry) => {
    setHistory((prev) => {
      const newHistory = [
        {
          id: Date.now(),
          fileName: entry.fileName,
          fileSize: entry.fileSize,
          conversionType: entry.conversionType,
          status: entry.status, // "success" | "error"
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, MAX_HISTORY);
      return newHistory;
    });
  };

  const clearHistory = () => setHistory([]);

  const removeEntry = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return { history, addEntry, clearHistory, removeEntry };
}
