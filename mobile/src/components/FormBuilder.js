import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import api from '../api/axios';

export default function FormBuilder({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);

  const addQuestion = (type) => {
    const newQuestion = {
      question: '',
      type: type,
      options: type === 'multiple_choice' ? ['', '', '', ''] : undefined
    };
    setQuestions([...questions, newQuestion]);
    setShowQuestionTypeModal(false);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'question') {
      newQuestions[index].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.replace('option', ''));
      newQuestions[index].options[optionIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        Alert.alert('Hata', 'Lütfen sınav başlığı girin');
        return;
      }

      if (questions.length === 0) {
        Alert.alert('Hata', 'En az bir soru eklemelisiniz');
        return;
      }

      if (questions.some(q => !q.question.trim())) {
        Alert.alert('Hata', 'Lütfen tüm soruları doldurun');
        return;
      }

      if (questions.some(q => 
        q.type === 'multiple_choice' && 
        q.options.some(opt => !opt.trim())
      )) {
        Alert.alert('Hata', 'Lütfen tüm seçenekleri doldurun');
        return;
      }

      const formData = {
        title,
        description,
        questions: questions.map(q => ({
          question: q.question,
          type: q.type,
          options: q.options
        }))
      };

      await api.post('/api/exams', formData);
      Alert.alert('Başarılı', 'Sınav başarıyla oluşturuldu', [
        { 
          text: 'Tamam', 
          onPress: () => navigation.goBack() 
        }
      ]);
    } catch (error) {
      console.error('Sınav oluşturma hatası:', error);
      Alert.alert(
        'Hata',
        'Sınav oluşturulurken bir hata oluştu: ' + error.message
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sınav Başlığı</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Sınav başlığını girin"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Sınav açıklamasını girin"
          multiline
        />
      </View>

      <Text style={styles.sectionTitle}>Sorular</Text>
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.label}>
            Soru {index + 1} ({question.type === 'text' ? 'Açık Uçlu' : 'Çoktan Seçmeli'})
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={question.question}
            onChangeText={(value) => updateQuestion(index, 'question', value)}
            placeholder="Soruyu girin"
            multiline
          />

          {question.type === 'multiple_choice' && (
            <View style={styles.optionsContainer}>
              <Text style={styles.optionsTitle}>Seçenekler:</Text>
              {question.options.map((option, optionIndex) => (
                <TextInput
                  key={optionIndex}
                  style={styles.optionInput}
                  value={option}
                  onChangeText={(value) => 
                    updateQuestion(index, `option${optionIndex}`, value)
                  }
                  placeholder={`${String.fromCharCode(65 + optionIndex)}) Seçenek`}
                />
              ))}
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowQuestionTypeModal(true)}
      >
        <Text style={styles.addButtonText}>+ Soru Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Sınavı Oluştur</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showQuestionTypeModal}
        onRequestClose={() => setShowQuestionTypeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Soru Tipi Seçin</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => addQuestion('text')}
            >
              <Text style={styles.modalButtonText}>Açık Uçlu Soru</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => addQuestion('multiple_choice')}
            >
              <Text style={styles.modalButtonText}>Çoktan Seçmeli</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowQuestionTypeModal(false)}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  questionContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  optionsContainer: {
    marginTop: 12,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  optionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  addButton: {
    padding: 16,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    marginTop: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  }
}); 