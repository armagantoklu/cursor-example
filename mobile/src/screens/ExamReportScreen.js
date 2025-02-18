import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import api from '../api/axios';

export default function ExamReportScreen({ route }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { exam } = route.params;

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await api.get(`/api/exams/${exam.id}/responses`);
      setResponses(response.data);
    } catch (error) {
      console.error('Cevaplar yüklenirken hata:', error);
      Alert.alert('Hata', 'Sınav cevapları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{exam.title}</Text>
        <Text style={styles.description}>{exam.description}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          Toplam Cevap: {responses.length}
        </Text>
      </View>

      {responses.map((response, index) => (
        <View key={response.id} style={styles.responseCard}>
          <Text style={styles.studentName}>
            {response.student?.name || 'İsimsiz Öğrenci'}
          </Text>
          {response.answers.map((answer, answerIndex) => (
            <View key={answerIndex} style={styles.answer}>
              <Text style={styles.questionText}>
                Soru {answerIndex + 1}: {exam.questions[answerIndex]?.question}
              </Text>
              <Text style={styles.answerText}>
                Cevap: {answer.answer}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
  },
  stats: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 16,
    color: '#007AFF',
  },
  responseCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  answer: {
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 16,
    color: '#666',
  },
}); 