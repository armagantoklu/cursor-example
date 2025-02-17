module.exports = (sequelize, DataTypes) => {
  const ExamResponse = sequelize.define('ExamResponse', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    answers: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    examId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Exams',
        key: 'id'
      }
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return ExamResponse;
}; 