const express = require('express');
const router = express.Router();
const { Exam, User, ExamResponse } = require('../models');
const auth = require('../middleware/auth');

// Sınav oluşturma (sadece öğretmenler)
router.post('/', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Yetkisiz işlem' });
    }

    const exam = await Exam.create({
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,
      teacherId: req.user.id
    });

    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
});

// Sınavları listeleme
router.get('/', auth, async (req, res, next) => {
  try {
    const where = req.user.role === 'teacher' ? { teacherId: req.user.id } : {};
    
    const exams = await Exam.findAll({
      where,
      include: [{
        model: User,
        as: 'teacher',
        attributes: ['name', 'email']
      }]
    });

    res.json(exams);
  } catch (error) {
    next(error);
  }
});

// Sınav detayı
router.get('/:id', auth, async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'teacher',
        attributes: ['name', 'email']
      }]
    });

    if (!exam) {
      return res.status(404).json({ message: 'Sınav bulunamadı' });
    }

    res.json(exam);
  } catch (error) {
    next(error);
  }
});

// Sınav cevabı gönderme
router.post('/:examId/submit', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Yetkisiz işlem' });
    }

    const examId = req.params.examId;
    if (!examId) {
      return res.status(400).json({ message: 'Sınav ID gerekli' });
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Sınav bulunamadı' });
    }

    // Cevapları doğru formatta kaydet
    const formattedAnswers = req.body.answers.map((answer, index) => ({
      questionIndex: index,
      answer: answer.answer
    }));

    const response = await ExamResponse.create({
      examId: exam.id,
      studentId: req.user.id,
      answers: formattedAnswers
    });

    res.status(201).json(response);
  } catch (error) {
    console.error('Sınav cevabı kaydetme hatası:', error);
    next(error);
  }
});

// Sınav cevaplarını getirme (sadece öğretmenler)
router.get('/:examId/responses', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Yetkisiz işlem' });
    }

    const examId = req.params.examId;
    const exam = await Exam.findByPk(examId);

    if (!exam) {
      return res.status(404).json({ message: 'Sınav bulunamadı' });
    }

    // Sadece kendi sınavlarının cevaplarını görebilir
    if (exam.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Bu sınavın cevaplarını görüntüleme yetkiniz yok' });
    }

    const responses = await ExamResponse.findAll({
      where: { examId },
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      }],
      order: [['submittedAt', 'DESC']]
    });

    res.json(responses);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 