const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.url, {
  dialect: 'postgres',
  logging: false
});

// TimescaleDB uzantısını etkinleştir
sequelize.query('CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;');

const db = {
  sequelize,
  Sequelize
};

// Modelleri yükle
db.User = require('./User')(sequelize, Sequelize);
db.Exam = require('./Exam')(sequelize, Sequelize);
db.ExamResponse = require('./ExamResponse')(sequelize, Sequelize);

// İlişkileri tanımla
db.Exam.belongsTo(db.User, { as: 'teacher', foreignKey: 'teacherId' });
db.ExamResponse.belongsTo(db.User, { as: 'student', foreignKey: 'studentId' });
db.ExamResponse.belongsTo(db.Exam, { foreignKey: 'examId' });

module.exports = db; 