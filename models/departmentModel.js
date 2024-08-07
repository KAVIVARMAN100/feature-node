import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Department = db.define('department_tb', {
  department_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  department_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ministry_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'department_tb',
  timestamps: false, // Ensure timestamps are not created automatically
});

export default Department;
