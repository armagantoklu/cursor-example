import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet } from 'react-native';

const FormBuilder = ({ onSave }) => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: '',
      options: type === 'multiple_choice' ? [''] : [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formHeader}>
        <TextInput
          style={styles.input}
          placeholder="Sınav Başlığı"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Sınav Açıklaması"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={styles.questionsList}>
        {questions.map((q) => (
          <View key={q.id} style={styles.questionItem}>
            <TextInput
              style={styles.input}
              placeholder="Soru"
              value={q.question}
              onChangeText={(text) => updateQuestion(q.id, 'question', text)}
            />
            {q.type === 'multiple_choice' && (
              <View style={styles.options}>
                {q.options.map((option, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={`Seçenek ${index + 1}`}
                    value={option}
                    onChangeText={(text) => {
                      const newOptions = [...q.options];
                      newOptions[index] = text;
                      updateQuestion(q.id, 'options', newOptions);
                    }}
                  />
                ))}
                <Button
                  title="Seçenek Ekle"
                  onPress={() => {
                    const newOptions = [...q.options, ''];
                    updateQuestion(q.id, 'options', newOptions);
                  }}
                />
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.formActions}>
        <Button title="Çoktan Seçmeli Soru Ekle" onPress={() => addQuestion('multiple_choice')} />
        <Button title="Açık Uçlu Soru Ekle" onPress={() => addQuestion('text')} />
        <Button title="Sınavı Kaydet" onPress={() => onSave({ title, description, questions })} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formHeader: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  questionsList: {
    marginBottom: 20,
  },
  questionItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  options: {
    marginLeft: 20,
  },
  formActions: {
    gap: 10,
  },
});

export default FormBuilder; 