import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import api from '../api/axios';

export default function ExamTakerScreen({ route, navigation }) {
  const { exam } = route.params;
  const [answers, setAnswers] = useState({});

  const renderQuestionInput = (question, index) => {
    if (question.type === 'multiple_choice') {
      return (
        <View style={styles.optionsContainer}>
          {question.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={optionIndex}
              style={[
                styles.optionButton,
                answers[index] === optionIndex && styles.selectedOption
              ]}
              onPress={() => {
                setAnswers(prev => ({
                  ...prev,
                  [index]: optionIndex
                }));
              }}
            >
              <Text style={[
                styles.optionText,
                answers[index] === optionIndex && styles.selectedOptionText
              ]}>
                {String.fromCharCode(65 + optionIndex)}) {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <TextInput
        style={styles.answerInput}
        multiline
        placeholder="Cevabınızı buraya yazın..."
        value={answers[index] || ''}
        onChangeText={(text) => 
          setAnswers(prev => ({ ...prev, [index]: text }))
        }
      />
    );
  };

  const handleSubmit = async () => {
    try {
      const unansweredQuestions = exam.questions.filter((_, index) => 
        answers[index] === undefined || answers[index] === ''
      );

      if (unansweredQuestions.length > 0) {
        Alert.alert('Uyarı', 'Lütfen tüm soruları cevaplayın');
        return;
      }

      const formattedAnswers = exam.questions.map((question, index) => ({
        questionId: question.id,
        answer: question.type === 'multiple_choice' 
          ? question.options[answers[index]]
          : answers[index]
      }));

      await api.post(`/api/exams/${exam.id}/submit`, {
        answers: formattedAnswers
      });

      Alert.alert(
        'Başarılı', 
        'Sınav cevaplarınız kaydedildi', 
        [
          { 
            text: 'Tamam', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('Sınav gönderme hatası:', error);
      Alert.alert(
        'Hata',
        'Sınav gönderilirken bir hata oluştu: ' + error.message
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.examHeader}>
        <Text style={styles.examTitle}>{exam.title}</Text>
        <Text style={styles.examDescription}>{exam.description}</Text>
      </View>

      {exam.questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {index + 1}. {question.question}
          </Text>
          {renderQuestionInput(question, index)}
        </View>
      ))}

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Sınavı Tamamla</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  examHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  examTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  examDescription: {
    fontSize: 16,
    color: '#666',
  },
  questionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  submitButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
}); 