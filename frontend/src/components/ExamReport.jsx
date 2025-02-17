import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ExamReport = ({ exam }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await api.get(`/api/exams/${exam.id}/responses`);
        setResponses(response.data);
      } catch (error) {
        console.error('Cevaplar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [exam.id]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="exam-report">
      <h2>{exam.title} - Öğrenci Cevapları</h2>
      <p>{exam.description}</p>

      {responses.length === 0 ? (
        <p>Henüz hiç cevap verilmemiş.</p>
      ) : (
        responses.map((response) => (
          <div key={response.id} className="student-response">
            <h3>Öğrenci: {response.student.name}</h3>
            <p>Gönderim Tarihi: {new Date(response.submittedAt).toLocaleString()}</p>
            
            <div className="answers">
              {exam.questions.map((question, index) => (
                <div key={index} className="question-answer">
                  <div className="question">
                    <strong>Soru {index + 1}:</strong> {question.question}
                  </div>
                  
                  <div className="answer">
                    <strong>Cevap:</strong>
                    {question.type === 'multiple_choice' ? (
                      <span className="multiple-choice-answer">
                        {response.answers[index]?.answer}
                      </span>
                    ) : question.type === 'table' ? (
                      <div className="table-answer">
                        <div className="table-display">
                          {question.table.data.map((row, rowIndex) => (
                            <div key={rowIndex} className="table-row">
                              {row.map((cell, colIndex) => (
                                <div key={colIndex} className="table-cell">
                                  {cell}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <p className="table-response">
                          Öğrenci Cevabı: {response.answers[index]?.answer}
                        </p>
                      </div>
                    ) : (
                      <p className="text-answer">
                        {response.answers[index]?.answer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExamReport; 