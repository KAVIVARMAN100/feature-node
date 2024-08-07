import { DataTypes } from 'sequelize';
import db from '../config/database.js';


const Category = db.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'category_tb',
  timestamps: false,
});

// // Define associations
// Category.hasMany(SubCategory, { foreignKey: 'category_id' });
// Category.hasMany(Course, { foreignKey: 'category_id' });

export default Category;
