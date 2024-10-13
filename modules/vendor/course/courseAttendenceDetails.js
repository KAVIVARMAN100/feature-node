import { Op, fn, col } from 'sequelize';
import CourseCandidate from '../../../models/courseCandidateModel.js';
import Attendance from '../../../models/attendenceModel.js';
import Course from '../../../models/courseModel.js';
import Candidate from '../../../models/candidateModel.js';
import AppError from '../../../utils/AppError.js';
import { v4 as uuidv4 } from 'uuid'; // For generating a unique ID

export const courseAttendedDetails = async (candidateId, status) => {
    try {
        
        const currentDate = new Date().toISOString().split('T')[0] + ' 00:00:00'; // 'Y-m-d 00:00:00' format
        
        if (!candidateId || !status) {
            throw new AppError('Bad Request: Not enough information', 400);
        }

        let queryOptions = {
            where: {
                candidate_id: candidateId,
                status: 'approved'
            },
            include: [
                {
                    model: Course, // Join with the Course table
                    as: 'course',
                    attributes: ['course_name', 'start_date', 'end_date', 'session', 'days', 'descriptions', 'attachment']
                },
                {
                    model: Attendance, // Join with the Attendance table (if required)
                    as: 'attendance',
                    attributes: [[Sequelize.fn('COUNT', Sequelize.col('attendance.course_id')), 'attendedCount']],
                    required: false // LEFT JOIN equivalent
                }
            ],
            group: ['CourseCandidate.course_id']
        };

        if (status === 'current') {
            queryOptions.where.attended = 'no';
            queryOptions.include[0].where = {
                start_date: { [Op.lte]: currentDate },
                end_date: { [Op.gte]: currentDate }
            };
        } else if (status === 'done') {
            queryOptions.include[0].where = {
                end_date: { [Op.lt]: currentDate }
            };
        } else if (status === 'upcoming') {
            queryOptions.include[0].where = {
                start_date: { [Op.gt]: currentDate }
            };
            delete queryOptions.include[1]; // No need for attendance in 'upcoming' case
        }

        // Fetch course details
        const courseDetails = await CourseCandidate.findAll(queryOptions);
        let totalHours = 0;

        // Fetch candidate details
        const candidateDetails = await Candidate.findOne({ where: { candidate_id: candidateId } });

        // Calculate total hours for 'current' or 'done' courses
        if (status === 'current' || status === 'done') {
            courseDetails.forEach(detail => {
                const attendedCount = parseInt(detail.dataValues.attendance[0]?.attendedCount || 0, 10);
                const dailyHours = detail.course.session === 'full' ? 6 : 3;
                detail.dataValues.totalHoursAttended = attendedCount * dailyHours;
                totalHours += attendedCount * dailyHours;
            });
        }

        return {
            candidateDetails,
            courseDetails,
            totalHours
        };
    } catch (error) {
        console.error('Error fetching course attended details:', error);
        throw new AppError('Failed to fetch course attended details', 500, error.message);
    }
};




export const getCandidateCourse = async (req, res, next) => {
    try {
        const candidateId = req.query.id;
        const status = req.query.status;

        if (!candidateId || !status) {
            return next(new AppError('Not enough information', 400));
        }

        const date = new Date();
        date.setHours(0, 0, 0, 0); // Setting time to 00:00:00

        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(0, 0, 0, 0);

        let queryOptions = {
            where: { candidate_id: candidateId },
            include: [
                {
                    model: Candidate,
                    as: 'candidate',
                    attributes: ['candidate_name'],
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['course_name', 'start_date', 'end_date', 'days', 'session'],
                    where: {} // This will be used to set the `start_date` and `end_date` conditions
                },
                {
                    model: Attendance,
                    as: 'attendances',
                    attributes: ['course_id'],
                },
            ],
            //group: ['CourseCandidate.course_id'],
        };

        let fullHours = 0;
        let halfHours = 0;
        let totalRecentHours = 0;
        let totalDoneHours = 0;

        // Handle different status cases
        if (status === 'upcoming') {
            queryOptions.include[1].where = {
                start_date: { [Op.gt]: date },
            };
        } else if (status === 'current') {
            queryOptions.include[1].where = {
                start_date: { [Op.lte]: date },
                end_date: { [Op.gte]: date },
            };

            const courseCandidates = await CourseCandidate.findAll(queryOptions);

            courseCandidates.forEach((courseCandidate) => {
                const attendanceCount = courseCandidate.attendances.length;

                if (courseCandidate.course.session === 'full') {
                    fullHours = attendanceCount * 6;
                    totalRecentHours += fullHours;
                } else if (['morning', 'afternoon'].includes(courseCandidate.course.session)) {
                    halfHours = attendanceCount * 3;
                    totalRecentHours += halfHours;
                }
            });
        } else if (status === 'done') {
            queryOptions.include[1].where = {
                end_date: { [Op.lt]: date },
            };

            const courseCandidates = await CourseCandidate.findAll(queryOptions);

            courseCandidates.forEach((courseCandidate) => {
                const attendanceCount = courseCandidate.attendances.length;

                if (courseCandidate.course.session === 'full') {
                    fullHours = attendanceCount * 6;
                    totalDoneHours += fullHours;
                } else if (['morning', 'afternoon'].includes(courseCandidate.course.session)) {
                    halfHours = attendanceCount * 3;
                    totalDoneHours += halfHours;
                }
            });
        } else {
            return next(new AppError('Invalid status', 400));
        }

        const totalCandidateHours = totalRecentHours + totalDoneHours;

        const candidateDetails = await Candidate.findByPk(candidateId);

        res.json({
            candidateDetails,
            totalCandidateHours,
        });
    } catch (error) {
        console.error('Error fetching candidate course details:', error);
        next(error);
    }
};

export const getCourseUcid = async (req, res, next) => {
    try {
        const courseId = req.query.id;

        if (!courseId) {
            return next(new AppError('Bad Request: Not Enough Information', 400));
        }

        const course = await Course.findByPk(courseId);

        if (course) {
            const ucid = uuidv4(); // Generate a unique ID
            course.ucid = ucid;

            const saved = await course.save();
            if (saved) {
                return res.status(200).json({ ucid });
            } else {
                throw new AppError('Error saving course data', 500);
            }
        } else {
            return next(new AppError('Course not available', 404));
        }
    } catch (error) {
        console.error('Error generating UCID:', error);
        next(error);
    }
};

