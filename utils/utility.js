import Category from '../models/categoryModel.js';
import SubCategory from '../models/subCategoryModel.js';

export const addNewCategory = async (newCategory, newSubCategory) => {
  try {
    const category = await Category.create({ name: newCategory });
    const subCategory = await SubCategory.create({ name: newSubCategory, categoryId: category.id });
    return { categoryId: category.id, subCategoryId: subCategory.id };
  } catch (error) {
    throw new Error('Error adding new category and subcategory');
  }
};

export const addNewSubCategory = async (categoryId, newSubCategory) => {
  try {
    const subCategory = await SubCategory.create({ name: newSubCategory, categoryId });
    return { categoryId, subCategoryId: subCategory.id };
  } catch (error) {
    throw new Error('Error adding new subcategory');
  }
};

export  const checkCategory = async (req) => {
  const { categoryId, newCategory, subCategoryId, newSubCategory } = req.body;

  if (newCategory && newSubCategory) {
    return await addNewCategory(newCategory, newSubCategory);
  } else if (!newCategory && newSubCategory) {
    return await addNewSubCategory(categoryId, newSubCategory);
  } else if (categoryId && subCategoryId) {
    return { categoryId, subCategoryId };
  } else {
    throw new Error('Not enough information');
  }
};
