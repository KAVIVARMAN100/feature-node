
import Course from '../../../models/courseModel.js';
import CourseCandidate from '../../../models/courseCandidateModel.js';



export const getAllCourses = async (req, res) => {
  try {
    const subCategoryId = req.query.id;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10; // Set a default limit if none is provided


    // Define the query options
    let options = {
      where: {
        is_deleted: 0
      },
      include: [{
        model: CourseCandidate,
        as: 'courseCandidates', // Use the alias defined in your model associations
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


  