// services/courseService.js

import AppError from '../../../utils/AppError.js';
import Course from '../../../models/courseModel.js';

export const validateCourseUID = async (req, res) => {
    try {
        const uid = req.query.uid;

        if (!uid) {
            throw new AppError('UID is required', 400);
        }

        // Fetch the course by UID
        const course = await Course.findOne({
            where: {
                uid: uid
            }
        });

        // Respond with the course data or an empty object
        res.json({ data: course ? course.toJSON() : {} });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
