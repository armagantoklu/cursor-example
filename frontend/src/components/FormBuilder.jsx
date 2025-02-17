import React, { useState } from 'react';

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
      table: type === 'table' ? { rows: 2, cols: 2, data: [] } : null,
    };

    // Tablo için boş veri matrisi oluştur
    if (type === 'table') {
      newQuestion.table.data = Array(2).fill().map(() => Array(2).fill(''));
    }

    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateTableSize = (id, rows, cols) => {
    // Minimum 1 satır ve 1 sütun olmasını sağla
    const safeRows = Math.max(1, Math.min(10, rows || 1));
    const safeCols = Math.max(1, Math.min(10, cols || 1));

    setQuestions(questions.map(q => {
      if (q.id === id) {
        // Yeni boyutta boş veri matrisi oluştur
        const newData = Array(safeRows).fill().map(() => Array(safeCols).fill(''));
        
        // Mevcut verileri kopyala
        for (let i = 0; i < Math.min(safeRows, q.table.data.length); i++) {
          for (let j = 0; j < Math.min(safeCols, q.table.data[i].length); j++) {
            newData[i][j] = q.table.data[i][j];
          }
        }

        return {
          ...q,
          table: {
            rows: safeRows,
            cols: safeCols,
            data: newData
          }
        };
      }
      return q;
    }));
  };

  const updateTableCell = (id, rowIndex, colIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const newData = [...q.table.data];
        newData[rowIndex][colIndex] = value;
        return {
          ...q,
          table: {
            ...q.table,
            data: newData
          }
        };
      }
      return q;
    }));
  };

  const handleSubmit = () => {
    const formattedQuestions = questions.map(q => ({
      type: q.type,
      question: q.question,
      options: q.options || [],
      table: q.table
    }));

    onSave({
      title,
      description,
      questions: formattedQuestions
    });
  };

  return (
    <div className="form-builder">
      <div className="form-header">
        <input
          type="text"
          placeholder="Sınav Başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Sınav Açıklaması"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="questions-list">
        {questions.map((q) => (
          <div key={q.id} className="question-item">
            <input
              type="text"
              placeholder="Soru"
              value={q.question}
              onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
            />

            {q.type === 'multiple_choice' && (
              <div className="options">
                {q.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Seçenek ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...q.options];
                      newOptions[index] = e.target.value;
                      updateQuestion(q.id, 'options', newOptions);
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newOptions = [...q.options, ''];
                  updateQuestion(q.id, 'options', newOptions);
                }}>
                  Seçenek Ekle
                </button>
              </div>
            )}

            {q.type === 'table' && (
              <div className="table-container">
                <div className="table-controls">
                  <label>
                    Satır:
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={q.table.rows}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '.') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
                        updateTableSize(q.id, value, q.table.cols);
                      }}
                    />
                  </label>
                  <label>
                    Sütun:
                    <input
                      type="number"
                      min="1"
                      value={q.table.cols}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1; // Sayı değilse 1 kullan
                        updateTableSize(q.id, q.table.rows, value);
                      }}
                    />
                  </label>
                </div>
                <table className="editable-table">
                  <tbody>
                    {q.table.data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex}>
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => updateTableCell(q.id, rowIndex, colIndex, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button onClick={() => addQuestion('multiple_choice')}>Çoktan Seçmeli Soru Ekle</button>
        <button onClick={() => addQuestion('text')}>Açık Uçlu Soru Ekle</button>
        <button onClick={() => addQuestion('table')}>Tablo Ekle</button>
        <button onClick={handleSubmit}>Sınavı Kaydet</button>
      </div>
    </div>
  );
};

export default FormBuilder; 