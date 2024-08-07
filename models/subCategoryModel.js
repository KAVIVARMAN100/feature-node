import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import Course from './courseModel.js';
import Category from './categoryModel.js';

const SubCategory = db.define('SubCategory', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'subcategories_tb', // Ensure this matches your actual table name
  timestamps: false,
});

// // Define associations
// SubCategory.belongsTo(Category, { foreignKey: 'category_id' });
// SubCategory.hasMany(Course, { foreignKey: 'subcategory_id' });

export default SubCategory;
