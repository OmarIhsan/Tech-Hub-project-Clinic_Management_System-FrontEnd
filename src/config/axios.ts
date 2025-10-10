










































import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // غيّر هذا حسب رابط API عندك
  timeout: 10000,  // وقت الانتظار قبل إلغاء الطلب (10 ثواني)
});

export default api;
