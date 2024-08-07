import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const CandidateStatusMsg = db.define('CandidateStatusMsg', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  candidate_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  course_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'candidate_status_msg_tb',
  timestamps: false // As you are handling the `created_at` manually
});

export default CandidateStatusMsg;
