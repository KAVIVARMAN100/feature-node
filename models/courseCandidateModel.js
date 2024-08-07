import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import Course from './courseModel.js'; // Adjust the path as necessary

const CourseCandidate = db.define('course_candidate_tb', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  course_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  candidate_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  ministry_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  attended: {
    type: DataTypes.STRING(50),
    allowNull: true // Assuming this can be null initially
  }
}, {
  tableName: 'course_candidate_tb',
  timestamps: false // Assuming there are no createdAt or updatedAt columns
});

export default CourseCandidate;
