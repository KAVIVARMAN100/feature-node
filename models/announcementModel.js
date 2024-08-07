import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Announcement = db.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ordering: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'announcement_tb',
  timestamps: false, // Set to true if you have timestamps (createdAt, updatedAt)
});

export default Announcement;
