import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

export default function ExamListScreen({ route, navigation }) {
  const [exams, setExams] = useState([]);
  const { user } = route.params;

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/api/exams');
      setExams(response.data);
    } catch (error) {
      console.error('Sınavlar yüklenirken hata:', error);
      Alert.alert('Hata', 'Sınavlar yüklenirken bir hata oluştu');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    } catch (error) {
      console.error('Çıkış yaparken hata:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
    }
  };

  // Navigation options'ı ayarla
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Çıkış</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  const renderExamCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.examCard}
      onPress={() => {
        if (user.role === 'teacher') {
          navigation.navigate('ExamReport', { exam: item });
        } else {
          navigation.navigate('ExamTaker', { exam: item });
        }
      }}
    >
      <Text style={styles.examTitle}>{item.title}</Text>
      <Text style={styles.examDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {user.role === 'teacher' && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('FormBuilder')}
        >
          <Text style={styles.createButtonText}>+ Yeni Sınav Oluştur</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={exams}
        renderItem={renderExamCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  examCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  examDescription: {
    color: '#666',
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginRight: 16,
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  }
}); 