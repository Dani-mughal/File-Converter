import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 120000, // 2 minutes for large files
});

/**
 * Upload files for conversion.
 * @param {File[]} files - The files to convert.
 * @param {string} targetFormat - e.g. "pdf", "docx", "zip", "mp3"
 * @param {function} onProgress - Progress callback (0-100).
 * @param {AbortSignal} signal - Optional abort signal.
 * @returns {Promise<Blob>} The converted file blob.
 */
export async function convertFile(files, targetFormat, onProgress, signal) {
  const formData = new FormData();
  
  // Append multiple files
  if (Array.isArray(files)) {
    files.forEach(f => formData.append('files', f));
  } else {
    formData.append('files', files);
  }
  
  formData.append('targetFormat', targetFormat);

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
export function getOutputExtension(targetFormat) {
  const map = {
    'docx': '.docx',
    'pdf': '.pdf',
    'txt': '.txt',
    'html': '.html',
    'xlsx': '.xlsx',
    'csv': '.csv',
    'json': '.json',
    'jpg': '.jpg',
    'png': '.png',
    'webp': '.webp',
    'svg': '.svg',
    'mp3': '.mp3',
    'wav': '.wav',
    'aac': '.aac',
    'mp4': '.mp4',
    'avi': '.avi',
    'mov': '.mov',
    'gif': '.gif',
    'zip': '.zip',
    'rar': '.rar',
    '7z': '.7z',
    'epub': '.epub',
  };
  return map[targetFormat] || `.${targetFormat}`;
}

/**
 * Get the output MIME type for a conversion type.
 */
export function getOutputMimeType(conversionType) {
  const map = {
    'pdf-to-word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf-to-excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'word-to-pdf': 'application/pdf',
    'docx-to-pdf': 'application/pdf',
    'image-to-pdf': 'application/pdf',
    'jpg-to-pdf': 'application/pdf',
    'webp-to-png': 'image/png',
    'webp-to-jpg': 'image/jpeg',
    'heic-to-jpg': 'image/jpeg',
    'heic-to-png': 'image/png',
    'png-to-svg': 'image/svg+xml',
    'mp4-to-mp3': 'audio/mpeg',
    'mp3-to-ogg': 'audio/ogg',
    'video-to-gif': 'image/gif',
    'zip': 'application/zip',
  };
  return map[conversionType] || 'application/octet-stream';
}

export default api;
