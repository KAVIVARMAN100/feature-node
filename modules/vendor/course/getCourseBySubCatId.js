
import Course from '../../../models/courseModel.js';

export const getCourseBySubCatId = async (req, res) => {
    try {
        const subCategoryId = req.query.id;
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        // Fetch courses based on subcategory ID with pagination
        const courses = await Course.findAll({
            where: {
                subcategory_id: subCategoryId,
                is_deleted: 0
            },
            order: [['course_id', 'DESC']],
            offset: offset,
            limit: limit
        });

        // Convert Sequelize result to plain array
        const courseData = courses.map(course => course.toJSON());

        // Get the total count of courses
        const coursesCountResult = await Course.findOne({
            attributes: [[Course.sequelize.fn('COUNT', Course.sequelize.col('*')), 'total']],
            where: {
                subcategory_id: subCategoryId,
                is_deleted: 0
            }
        });

        const coursesCount = coursesCountResult ? coursesCountResult.dataValues.total : 0;

        res.json({ data: courseData, count: coursesCount });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

