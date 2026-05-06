import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 120000,
});

export async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/upload', formData, {
    onUploadProgress: (e) => {
      if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    }
  });
  return response.data;
}

export async function startConversion(filePath, targetFormat, originalFileName) {
  const formData = new FormData();
  formData.append('filePath', filePath);
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
