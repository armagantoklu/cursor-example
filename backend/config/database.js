module.exports = {
  url: process.env.DATABASE_URL || 'postgres://admin:password@localhost:5432/exam_builder',
  options: {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}; 