import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

export default function LoginScreen({ navigation }) {
  const handleLogin = async (role) => {
    try {
      const email = role === 'teacher' ? 'teacher@example.com' : 'ogrenci1@example.com';
      
      console.log('Login isteği gönderiliyor:', {
        email,
        password: 'password123'
      });

      const response = await api.post('/api/auth/login', {
        email,
        password: 'password123'
      });

      // Token'ı kaydet
      await AsyncStorage.setItem('token', response.data.token);
      
      console.log('Login başarılı:', response.data);
      navigation.replace('ExamList', { user: response.data.user });
    } catch (error) {
      console.error('Login hatası:', error);
      Alert.alert(
        'Giriş Hatası',
        'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
        [{ text: 'Tamam' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exam Builder Mobile</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleLogin('teacher')}
        >
          <Text style={styles.buttonText}>Öğretmen Girişi</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleLogin('student')}
        >
          <Text style={styles.buttonText}>Öğrenci Girişi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
}); 