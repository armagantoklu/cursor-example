import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ExamList = ({ onSelectExam }) => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get('/api/exams');
        console.log('Gelen sınavlar:', response.data);
        setExams(response.data);
      } catch (error) {
        console.error('Sınavlar yüklenirken hata:', error);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="exam-list">
      <h2>Mevcut Sınavlar</h2>
      <div className="exams">
        {exams.map((exam) => (
          <div key={exam.id} className="exam-card">
            <h3>{exam.title}</h3>
            <p>{exam.description}</p>
            <button onClick={() => {
              console.log('Seçilen sınav:', exam);
              onSelectExam(exam);
            }}>
              Sınavı Başlat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamList; 