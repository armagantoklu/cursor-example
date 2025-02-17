require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exam');

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// CORS ayarları
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:19000'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veritabanı bağlantısı
sequelize.authenticate()
  .then(() => {
    console.log('TimescaleDB bağlantısı başarılı');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Veritabanı tabloları güncellendi');
  })
  .catch(err => {
    console.error('Veritabanı bağlantı hatası:', err);
    process.exit(1);
  });

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route bulunamadı' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 