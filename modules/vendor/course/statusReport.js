import { Op } from 'sequelize';
import Course from '../../../models/courseModel.js';
import CourseCandidate from '../../../models/courseCandidateModel.js';
import Candidate from '../../../models/candidateModel.js';
import AppError from '../../../utils/AppError.js';

export const fetchCourseStatusReport = async (req, res, next) => {
    try {
        const { ministryId, filter } = req.query;

        if (!ministryId) {
            return next(new AppError('Not Enough Information', 400));
        }

        let report;

        if (filter === 'all') {
            // Fetch courses with candidates who are in the specified ministry
            report = await Course.findAll({
                attributes: [
                    'course_id', 'course_name', 'start_date', 'end_date', 'session', 'days'
                ],
                include: [{
                    model: CourseCandidate,
                    as: 'courseCandidates',
                    attributes: [
                        'id', 'candidate_id', 'status', 'attended'
                    ],
                    include: [{
                        model: Candidate,
                        as: 'candidate',
                        attributes: [
                            'candidate_id', 'candidate_name'
                        ],
                        where: {
                            ministry_id: ministryId
                        }
                    }],
                    where: {
                        ministry_id: ministryId
                    }
                }],
                where: {
                    course_id: {
                        [Op.in]: (
                            await CourseCandidate.findAll({
                                attributes: ['course_id'],
                                where: { ministry_id: ministryId },
                                raw: true
                            })
                        ).map(result => result.course_id)
                    }
                }
            });
        } else if (filter === 'enrolled') {
            // Fetch course candidates enrolled in the specified ministry
            report = await CourseCandidate.findAll({
                attributes: [
                    'id', 'course_id', 'candidate_id', 'status', 'attended'
                ],
                include: [
                    {
                        model: Candidate,
                        as: 'candidate',
                        attributes: [
                            'candidate_id', 'candidate_name'
                        ]
                    },
                    {
                        model: Course,
                        as: 'course',
                        attributes: [
                            'course_id', 'course_name', 'start_date', 'end_date'
                        ]
                    }
                ],
                where: {
                    ministry_id: ministryId
                }
            });
        } else {
            throw new AppError('Invalid filter value', 400);
        }

        res.json({ data: report });
    } catch (error) {
        console.error('Error fetching course status report:', error);
        next(error);
    }
};
