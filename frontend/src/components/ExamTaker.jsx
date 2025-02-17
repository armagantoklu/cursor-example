import React, { useState } from 'react';
import api from '../api/axios';

const ExamTaker = ({ exam, onComplete }) => {
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Gönderilecek cevaplar:', {
        examId: exam.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer
        }))
      });

      const response = await api.post(`/api/exams/${exam.id}/submit`, {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer
        }))
      });
      
      if (response.status === 201) {
        alert('Sınav başarıyla tamamlandı!');
        onComplete();
      }
    } catch (error) {
      console.error('Sınav gönderme hatası:', error);
      alert('Sınav gönderilirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="exam-taker">
      <h2>{exam.title}</h2>
      <p>{exam.description}</p>

      <div className="questions">
        {exam.questions.map((question, index) => (
          <div key={index} className="question">
            <h3>Soru {index + 1}</h3>
            <p>{question.question}</p>

            {question.type === 'multiple_choice' ? (
              <div className="options">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex}>
                    <input
                      type="radio"
                      name={`question_${index}`}
                      value={option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      checked={answers[index] === option}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : question.type === 'table' ? (
              <div className="table-answer">
                <table className="editable-table">
                  <tbody>
                    {question.table.data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <textarea
                  placeholder="Tabloya ilişkin cevabınızı buraya yazın..."
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            ) : (
              <textarea
                placeholder="Cevabınızı buraya yazın..."
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmit} 
        className="submit-button"
        disabled={exam.questions.length !== Object.keys(answers).length}
      >
        Sınavı Tamamla
      </button>
    </div>
  );
};

export default ExamTaker; 