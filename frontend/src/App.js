import React, { useState, useEffect } from 'react';
import FormBuilder from './components/FormBuilder';
import ExamList from './components/ExamList';
import ExamTaker from './components/ExamTaker';
import api from './api/axios';
import { login, logout, getStoredAuth } from './services/auth';
import ExamReport from './components/ExamReport';

function App() {
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const storedUser = getStoredAuth();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'teacher') {
      const fetchExams = async () => {
        try {
          const response = await api.get('/api/exams');
          setExams(response.data);
        } catch (error) {
          console.error('Sınavlar yüklenirken hata:', error);
        }
      };
      fetchExams();
    }
  }, [user]);

  const handleLogin = async (role) => {
    try {
      let email;
      if (role === 'teacher') {
        email = 'teacher@example.com';
      } else {
        // Öğrenci seçim modalını göster
        const studentNumber = prompt('Hangi öğrenci olarak giriş yapmak istiyorsunuz? (1 veya 2)');
        if (studentNumber === '1') {
          email = 'ogrenci1@example.com';
        } else if (studentNumber === '2') {
          email = 'ogrenci2@example.com';
        } else {
          alert('Geçersiz öğrenci numarası!');
          return;
        }
      }

      const user = await login(email, 'password123');
      setUser(user);
    } catch (error) {
      console.error('Login hatası:', error);
      alert(`Giriş yapılırken bir hata oluştu: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setSelectedExam(null);
  };

  const handleSave = async (formData) => {
    try {
      console.log('Gönderilecek form verisi:', formData); // Debug için log
      const response = await api.post('/api/exams', formData);
      console.log('Sunucu cevabı:', response.data); // Debug için log
      alert('Sınav başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Sınav oluşturulurken hata:', error.response?.data || error);
      alert(`Sınav oluşturulurken bir hata oluştu: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleExamComplete = () => {
    setSelectedExam(null);
  };

  if (!user) {
    return (
      <div className="login-container">
        <h1>Exam Builder</h1>
        <div className="login-buttons">
          <button onClick={() => handleLogin('teacher')}>Öğretmen Girişi</button>
          <button onClick={() => handleLogin('student')}>Öğrenci Girişi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {user.role === 'teacher' ? (
        <>
          <h1>Öğretmen Paneli</h1>
          {selectedExam && showReport ? (
            <>
              <ExamReport exam={selectedExam} />
              <button 
                onClick={() => {
                  setSelectedExam(null);
                  setShowReport(false);
                }}
                className="back-button"
              >
                Geri Dön
              </button>
            </>
          ) : (
            <div className="teacher-dashboard">
              <div className="exam-creator">
                <h2>Yeni Sınav Oluştur</h2>
                <FormBuilder onSave={handleSave} />
              </div>

              <div className="exam-list">
                <h2>Oluşturduğunuz Sınavlar</h2>
                {exams.length === 0 ? (
                  <p>Henüz sınav oluşturmadınız.</p>
                ) : (
                  <div className="exam-grid">
                    {exams.map(exam => (
                      <div key={exam.id} className="exam-card">
                        <h3>{exam.title}</h3>
                        <p>{exam.description}</p>
                        <div className="exam-card-actions">
                          <button 
                            onClick={() => {
                              setSelectedExam(exam);
                              setShowReport(true);
                            }}
                            className="view-report-button"
                          >
                            Cevapları Görüntüle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <h1>Öğrenci Paneli</h1>
          {selectedExam ? (
            <ExamTaker 
              exam={selectedExam} 
              onComplete={handleExamComplete} 
            />
          ) : (
            <ExamList onSelectExam={setSelectedExam} />
          )}
        </>
      )}

      <button 
        onClick={handleLogout}
        className="logout-button"
      >
        Çıkış Yap
      </button>
    </div>
  );
}

export default App; 