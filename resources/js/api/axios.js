import axios from 'axios';
import useAuthStore from '../store/authStore';
import useProgressStore from '../store/progressStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiFormData = (url, method = 'POST', formData) => {
  return api({
    url,
    method,
    data: formData,
    headers: { 'Content-Type': undefined },
  });
};

// ── Excel / binary file download (Content-Disposition attachment) ──────────
export const downloadFile = async (url, filename) => {
  const { start, update, finish, fail } = useProgressStore.getState();
  start();

  try {
    const res = await api.get(url, {
      responseType: 'blob',
      headers: { Accept: '*/*' },
      onDownloadProgress: (e) => {
        if (e.total) {
          update(Math.round((e.loaded * 100) / e.total));
        } else {
          // Server មិន return Content-Length → estimate ស្វ័យប្រវត្តិ
          update((useProgressStore.getState().progress || 0) + 10);
        }
      },
    });

    const contentType = res.headers['content-type'] || '';

    // ✅ បើ server ត្រឡប់ JSON/HTML (error) ជំនួសឲ្យ file → អាន error ពិត
    if (contentType.includes('application/json') || contentType.includes('text/html')) {
      const text = await res.data.text();
      console.error('Download failed — server returned:', text);
      fail();
      throw new Error(text.slice(0, 300));
    }

    const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    finish();
  } catch (err) {
    fail();
    throw err;
  }
};

export const openFileInTab = async (url) => {
  const { start, update, finish, fail } = useProgressStore.getState();
  start();

  try {
    const res = await api.get(url, {
      responseType: 'blob',
      headers: { Accept: '*/*' },
      onDownloadProgress: (e) => {
        if (e.total) {
          update(Math.round((e.loaded * 100) / e.total));
        } else {
          update((useProgressStore.getState().progress || 0) + 10);
        }
      },
    });

    const contentType = res.headers['content-type'] || 'application/pdf';

    if (contentType.includes('application/json') || contentType.includes('text/html')) {
      const text = await res.data.text();
      fail();
      throw new Error(text.slice(0, 300));
    }

    const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
    window.open(blobUrl, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);

    finish();
  } catch (err) {
    fail();
    throw err;
  }
};

// ── PDF via base64 JSON response (mPDF controller returns JSON) ────────────
export const fetchPdfBlobUrl = async (url) => {
  const { start, update, finish, fail } = useProgressStore.getState();
  start();

  try {
    const res = await api.get(url, {
      onDownloadProgress: (e) => {
        if (e.total) {
          update(Math.round((e.loaded * 100) / e.total));
        } else {
          // JSON+base64 response ជាទូទៅមិនមាន Content-Length ច្បាស់ (chunked)
          update((useProgressStore.getState().progress || 0) + 15);
        }
      },
    });

    const { pdf, filename } = res.data;
    if (!pdf) {
      fail();
      throw new Error('Server response missing pdf field');
    }

    const binaryStr = atob(pdf);
    const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'application/pdf' });

    finish();
    return { blobUrl: URL.createObjectURL(blob), filename: filename ?? 'personnel.pdf' };
  } catch (err) {
    fail();
    throw err;
  }
};

export const debugPdfFetch = async (url) => {
  console.group('[PDF Debug]', url);
  try {
    const res = await api.get(url); // JSON — IDM won't intercept
    console.log('status      :', res.status);
    console.log('content-type:', res.headers['content-type']);

    const { pdf, filename } = res.data;
    if (!pdf) {
      console.error('response has no "pdf" field:', res.data);
      console.groupEnd();
      throw new Error('Server response missing pdf field');
    }

    console.log('base64 length:', pdf.length, 'chars (~', Math.round(pdf.length * 0.75 / 1024), 'KB decoded)');

    const binaryStr = atob(pdf);
    const bytes     = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
    const blob      = new Blob([bytes], { type: 'application/pdf' });
    const blobUrl   = URL.createObjectURL(blob);

    console.log('blob URL    :', blobUrl);
    console.log('filename    :', filename);
    console.groupEnd();
    return { blobUrl, filename: filename ?? 'personnel.pdf' };

  } catch (err) {
    console.error('[PDF Debug] error:', err);
    console.groupEnd();
    throw err;
  }
};

export default api;