import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 300000, // Increase to 5 mins for large files
});

// Response interceptor for better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 413) {
      error.message = "File is too large for the server to process. Please try a smaller file.";
    } else if (error.code === 'ECONNABORTED') {
      error.message = "The request timed out. This can happen with very large files or slow connections.";
    } else if (error.response?.data?.error) {
      error.message = error.response.data.error;
    }
    return Promise.reject(error);
  }
);

export async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append('files', file); // Use 'files' key to match backend plural expectations
  const response = await api.post('/convert/upload', formData, {
    onUploadProgress: (e) => {
      if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    }
  });
  return response.data;
}

export async function uploadFiles(files, onProgress) {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  const response = await api.post('/convert/upload', formData, {
    onUploadProgress: (e) => {
      if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    }
  });
  return response.data;
}

export async function startConversion(filePaths, targetFormat, originalFileName) {
  const formData = new FormData();
  // Ensure filePaths is sent as multiple values for the same key if it's an array
  if (Array.isArray(filePaths)) {
    filePaths.forEach(path => {
      if (path) formData.append('filePaths', path);
    });
  } else if (filePaths) {
    formData.append('filePaths', filePaths);
  }
  formData.append('targetFormat', targetFormat);
  formData.append('originalFileName', originalFileName);
  const response = await api.post('/convert', formData);
  return response.data.jobId;
}

export async function getJobStatus(jobId) {
  const response = await api.get(`/convert/status/${jobId}`);
  return response.data;
}

export async function downloadJobResult(jobId) {
  const response = await api.get(`/convert/download/${jobId}`, {
    responseType: 'blob'
  });
  return response.data;
}

export function getOutputExtension(targetFormat) {
  const map = {
    'docx': '.docx', 'pdf': '.pdf', 'txt': '.txt', 'html': '.html',
    'xlsx': '.xlsx', 'csv': '.csv', 'json': '.json', 'jpg': '.jpg',
    'png': '.png', 'webp': '.webp', 'svg': '.svg', 'mp3': '.mp3',
    'wav': '.wav', 'gif': '.gif', 'zip': '.zip'
  };
  return map[targetFormat] || `.${targetFormat}`;
}

export default api;
