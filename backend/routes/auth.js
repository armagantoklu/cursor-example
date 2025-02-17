const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Sabit kullanıcıları oluşturmak için fonksiyon
const createInitialUsers = async () => {
  const users = [
    {
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher',
      name: 'Öğretmen'
    },
    {
      email: 'ogrenci1@example.com',
      password: 'password123',
      role: 'student',
      name: 'Öğrenci 1'
    },
    {
      email: 'ogrenci2@example.com',
      password: 'password123',
      role: 'student',
      name: 'Öğrenci 2'
    }
  ];

  for (const userData of users) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        ...userData,
        password: hashedPassword
      });
    }
  }
};

// Uygulama başladığında sabit kullanıcıları oluştur
createInitialUsers();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route çalışıyor' });
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email ve şifre gerekli'
      });
    }

    const user = await User.findOne({ 
      where: { email },
      raw: false
    });

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 