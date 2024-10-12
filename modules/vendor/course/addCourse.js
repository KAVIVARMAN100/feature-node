import Course from "../../../models/courseModel.js";
import Category from '../../../models/categoryModel.js';
import SubCategory from '../../../models/subCategoryModel.js';
import uniqid from "uniqid";
import User from "../../../models/userModel.js"; 
import AppError from "../../../utils/AppError.js";
import { Op } from "sequelize";


export const addCourse = async (req, res) => {
  try {
    const {
      userId, courseName, uid, startDate, endDate, lastDateForNom, session,
      days, description, classSize, instructors, internalNotes,
      categoryId, newCategory, subCategoryId, newSubCategory
    } = req.body;

    if (!userId || !courseName || !uid || !startDate || !endDate || !lastDateForNom ||
        !session || !days || !description || !classSize || !instructors || !internalNotes ||!categoryId || !newCategory ||!subCategoryId ||!newSubCategory)  {
      return res.status(400).json({ error: 'Not enough information' });
    }

    // Check if userId exists in the user_tb table
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const categoryDetails = await checkCategory(categoryId, newCategory, subCategoryId, newSubCategory);

    const newCourse = await Course.create({
      user_id: userId,
      course_name: courseName,
      uid,
      ucid: uniqid(),
      start_date: startDate,
      end_date: endDate,
      lastDateForNom: lastDateForNom,
      session,
      days,
      descriptions: description,
      class_size: classSize,
      instructors,
      category_id: categoryDetails.categoryId,
      subcategory_id: categoryDetails.subCategoryId,
      confirmed_seat: 0,
      is_deleted: 0,
      internal_notes: internalNotes,
    });

    const files = req.files;
    if (files) {
      const img = files.img ? files.img[0] : null;
      const file = files.file ? files.file[0] : null;

      if (img) {
        const imgPath = `public/assets/attachments/${img.originalname}`;
        await img.mv(imgPath);
        newCourse.img = imgPath;
      }

      if (file) {
        const filePath = `public/assets/attachments/${file.originalname}`;
        await file.mv(filePath);
        newCourse.attachment = filePath;
      }
    }

    await newCourse.save();

    // Assume Users model and Mail service are defined elsewhere
    // const mailDetails = {
    //   to: userExists.email,
    //   subject: 'New course added',
    //   name: userExists.fullname,
    //   message: `You have been successfully added to the ${courseName} training.`,
    // };
    // await Mail.sendMail(mailDetails);

    res.json({ Message: 'Course is successfully added!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkCategory = async (categoryId, newCategory, subCategoryId, newSubCategory) => {
  console.log(categoryId,"categoryId, newCategory, subCategoryId, newSubCategory");
  
  if (newCategory && newSubCategory) {
    return addNewCategory(newCategory, newSubCategory);
  } else if (!newCategory && newSubCategory) {
    return addNewSubCategory(categoryId, newSubCategory);
  } else if (categoryId && subCategoryId) {
    return { categoryId, subCategoryId };
  } else {
    throw new Error('Not enough information to checkCategory');
  }
};

const addNewCategory = async (newCategory, newSubCategory) => {
  const category = await Category.create({ category: newCategory });

  if (newSubCategory) {
    const subCategory = await SubCategory.create({ category_id: category.id, name: newSubCategory });
    return { categoryId: category.id, subCategoryId: subCategory.id };
  } else {
    return { categoryId: category.id };
  }
};

const addNewSubCategory = async (categoryId, newSubCategory) => {
  const subCategory = await SubCategory.create({ category_id: categoryId, name: newSubCategory });
  return { categoryId, subCategoryId: subCategory.id };
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    for (const category of categories) {
      const subCategories = await SubCategory.findAll({ where: { category_id: category.id } });
      category.dataValues.subCategories = subCategories;
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getCategories = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.findAll();

    // Check if any categories were found
    if (categories.length > 0) {
      return res.json({ data: categories });
    } else {
      // If no categories found, return a 404 status with an error message
      return res.status(404).json({ error: 'Category not available!' });
    }
  } catch (error) {
    // Handle any errors that occurred during the query
    return res.status(500).json({ error: error.message });
  }
};



export const getHomeDetails = async (req, res) => {
  try {
    const { filter, offset, limit } = req.query;    
    const timezone = 'Asia/Brunei';
    const now = new Date();
    const startDate = new Date(now.setHours(0, 0, 0, 0));
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1, 0);
    endDate.setHours(0, 0, 0, 0);

    let result = {};

    if (filter === 'all' || filter === 'upcoming') {
      const upcomingCourses = await Course.findAll({
        where: {
          start_date: {
            [Op.gt]: endDate
          },
          is_deleted: 0
        },
        order: [['start_date', 'ASC']],
        offset: parseInt(offset, 10),
        limit: parseInt(limit, 10)
      });

      const upcomingCoursesCount = await Course.count({
        where: {
          start_date: {
            [Op.gt]: endDate
          },
          is_deleted: 0
        }
      });

      result.upcomingCourses = upcomingCourses;
      result.upcomingCoursesCount = upcomingCoursesCount;
    }

    if (filter === 'all' || filter === 'current') {
      const currentMonthCourses = await Course.findAll({
        where: {
          start_date: {
            [Op.between]: [startDate, endDate]
          },
          is_deleted: 0
        },
        order: [['start_date', 'ASC']],
        offset: parseInt(offset, 10),
        limit: parseInt(limit, 10)
      });

      const currentMonthCoursesCount = await Course.count({
        where: {
          start_date: {
            [Op.between]: [startDate, endDate]
          },
          is_deleted: 0
        }
      });

      result.currentMonthCourses = currentMonthCourses;
      result.currentMonthCoursesCount = currentMonthCoursesCount;
    }

    if (filter === 'all' || filter === 'latest') {
      const latestCourses = await Course.findAll({
        where: {
          start_date: {
            [Op.gt]: startDate
          },
          is_deleted: 0
        },
        order: [['course_id', 'DESC']],
        offset: parseInt(offset, 10),
        limit: parseInt(limit, 10)
      });

      const latestCoursesCount = await Course.count({
        where: {
          start_date: {
            [Op.gt]: startDate
          },
          is_deleted: 0
        }
      });

      result.latestCourses = latestCourses;
      result.latestCoursesCount = latestCoursesCount;
    }

    return res.json(result);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSubCategories = async (req, res, next) => {
    try {
        const categoryId = req.query.id;

        if (!categoryId) {
            return res.status(400).json({
                status: 'error',
                message: 'Category ID is required'
            });
        }

        const subCategories = await SubCategory.findAll({
            where: { category_id: categoryId },
            attributes: ['id', 'name']
        });
          
        if (subCategories.length === 0) {
            return res.status(404).json({
                message: 'No subcategories found for the provided category ID'
            });
        }

        res.json({
            data: subCategories
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        next(error); // Forward the error to the error handling middleware
    }
};



export const editCourse = async (req, res, next) => {
  try {
      const {
          courseId,
          courseName,
          uid,
          startDate,
          endDate,
          lastDateForNom,
          session,
          days,
          description,
          classSize,
          instructors,
          internalNotes,
          userId,
          fileRemoved,
          imgRemoved,
          categoryId,
          newCategory,
          subCategoryId,
          newSubCategory
      } = req.body;

      if (!courseName || !uid || !startDate || !endDate || !lastDateForNom || !session || !days || !description || !classSize || !instructors || !internalNotes) {
          return next(new AppError('Not enough information', 400));
      }

      let userTypeId;
      if (userId) {
          const user = await User.findByPk(userId);
          
          if (!user) return next(new AppError('Not enough information', 400));
          userTypeId = user.dataValues.user_type;
      }

      const course = await Course.findOne({
          where: {
              course_id: courseId,
              ...(userTypeId !== 115 && { user_id: userId })
          }
      });

      if (!course) return next(new AppError('Course not found.', 400));

      // Pass the appropriate parameters to the checkCategory function
      const categoryDetails = await checkCategory(categoryId, newCategory, subCategoryId, newSubCategory);
      console.log(categoryDetails,"This will be the categoryDetails");
console.log(courseName,);

      course.course_name = courseName;
      course.uid = uid;
      course.start_date = startDate;
      course.end_date = endDate;
      course.lastDateForNom = lastDateForNom;
      course.session = session;
      course.days = days;
      course.description = description;
      course.class_size = classSize;
      course.instructors = instructors;
      course.internal_notes = internalNotes;
      course.category_id = categoryDetails.categoryId;
      course.subcategory_id = categoryDetails.subCategoryId;
      

      // if (fileRemoved === 'true') course.attachment = '';
      // if (imgRemoved === 'true') course.img = '';

      // // Handle file uploads if any
      // if (req.files) {
      //     if (req.files.file) {
      //         const filePath = `/path/to/save/${req.files.file.name}`;
      //         await req.files.file.mv(filePath);
      //         course.attachment = filePath;
      //     }

      //     if (req.files.img) {
      //         const imgPath = `/path/to/save/${req.files.img.name}`;
      //         await req.files.img.mv(imgPath);
      //         course.img = imgPath;
      //     }
      // }

      await course.save();

      // await sendCourseUpdateEmail({
      //     courseId: course.course_id,
      //     ipaId: course.user_id,
      //     course_name: course.course_name
      // });

      res.json({ Message: 'Course is successfully updated!' });
  } catch (error) {
      console.error('Error updating course:', error);
      next(error);
  }
};


 
export const deleteCourse = async (req, res) => {
    try {
        const input = req.body; // Assuming the input comes in the request body
        
        if (!input.id) {
            return res.status(400).json({ message: 'Bad Request: Not enough information' });
        }

        // Fetch userId if provided
        let usertypeId;
        if (input.userId) {
            const user = await User.findOne({ where: { user_id: input.userId } });
            if (user) {
                usertypeId = user.user_type;
            } else {
                return res.status(400).json({ message: 'Not enough information' });
            }
        }

        // Find the course by id
        const course = await Course.findOne({
            where: { course_id: input.id }
        });

        if (course) {
            // Mark course as deleted
            course.is_deleted = 1;
            const result = await course.save();

            if (result) {
                return res.json({ message: 'Course has been deleted successfully!' });
            } else {
                return res.status(500).json({ message: 'Course deletion failed' });
            }
        } else {
            return res.status(400).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error in deleteCourse:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};







