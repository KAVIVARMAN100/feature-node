import { DataTypes } from 'sequelize';
import db from '../config/database.js';


const CourseEvaluation = db.define('CourseEvaluation', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  course_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  candidate_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  first_question: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  second_question: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  third_question: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fourth_question: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fifth_question: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  comments: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  create_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'course_evaluation',
  timestamps: false, // Disable timestamps if not needed
});

export default CourseEvaluation;
