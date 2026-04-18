import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 minutes for large files
});

/**
 * Upload a file for conversion.
 * @param {File} file - The file to convert.
 * @param {string} conversionType - e.g. "pdf-to-word", "pdf-to-excel", "image-to-pdf"
 * @param {function} onProgress - Progress callback (0-100).
 * @param {AbortSignal} signal - Optional abort signal.
 * @returns {Promise<Blob>} The converted file blob.
 */
export async function convertFile(file, conversionType, onProgress, signal) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('conversionType', conversionType);

  const response = await api.post('/convert', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    signal,
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(percent);
      }
    },
  });

  return response.data;
}

/**
 * Get the output file extension for a conversion type.
 */
export function getOutputExtension(conversionType) {
  const map = {
    'pdf-to-word': '.docx',
    'pdf-to-excel': '.xlsx',
    'word-to-pdf': '.pdf',
  };
  return map[conversionType] || '.bin';
}

/**
 * Get the output MIME type for a conversion type.
 */
export function getOutputMimeType(conversionType) {
  const map = {
    'pdf-to-word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf-to-excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'word-to-pdf': 'application/pdf',
  };
  return map[conversionType] || 'application/octet-stream';
}

export default api;
