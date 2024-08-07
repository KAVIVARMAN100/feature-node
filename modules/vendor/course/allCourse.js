// Assuming you have already set up your models and their associations

// services/courseService.js
import { Course, CourseCandidate } from '../models'; // Adjust the model import based on your structure
import Course from '../../../models/courseModel.js';
import CourseCandidate from '../../../models/courseCandidateModel.js';


export const getAllCourses = async (req, res) => {
  try {
    const subCategoryId = req.query.id;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Define the query options
    let options = {
      where: {
        is_deleted: 0
      },
      include: [{
        model: CourseCandidate,
        required: false // Left join
      }],
      order: [['course_id', 'DESC']],
      offset: offset,
      limit: limit,
      distinct: true // To ensure the count is correct
    };

    if (subCategoryId) {
      options.where.subcategory_id = subCategoryId;
    }

    // Fetch the courses and the total count
    const result = await Course.findAndCountAll(options);

    res.json({
      data: result.rows,
      count: result.count
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  