import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emülatör için IP adresi ayarı
const baseURL = Platform.select({
  android: 'http://10.0.2.2:5001',  // Android emülatör için
  ios: 'http://localhost:5001',     // iOS için
  default: 'http://localhost:5001'
});

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Token'ı ekleyen interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token alınırken hata:', error);
    }
    
    console.log('API İsteği:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
      baseURL: config.baseURL
    });
    
    return config;
  },
  error => Promise.reject(error)
);

// Debug için request/response logları
api.interceptors.response.use(
  response => {
    console.log('API Cevabı:', response.data);
    return response;
  },
  error => {
    console.error('API Hatası:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default api; 