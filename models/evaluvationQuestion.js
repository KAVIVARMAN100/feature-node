import { DataTypes } from 'sequelize';
import db from '../config/database.js';


const EvaluationQuestions = db.define('EvaluationQuestions', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  first_question: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  second_question: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  third_question: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  fourth_question: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  fifth_question: {
    type: DataTypes.STRING(1000),
    allowNull: true
  }
}, {
  tableName: 'evaluation_questions',
  timestamps: false // Assuming the table does not have createdAt and updatedAt fields
});

export default EvaluationQuestions;
