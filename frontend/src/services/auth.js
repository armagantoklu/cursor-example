import api from '../api/axios';

export const login = async (email, password) => {
  try {
    console.log('Login isteği gönderiliyor:', { email, password });
    
    const response = await api.post('/api/auth/login', 
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Login cevabı:', response.data);

    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return user;
  } catch (error) {
    console.error('Login hatası:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

export const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (token && user) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return user;
  }
  
  return null;
}; 