import Candidate from '../../../models/candidateModel.js'; // Adjust path as per your project structure
import Course from '../../../models/courseModel.js'; // Adjust path as per your project structure
import CourseCandidate from '../../../models/courseCandidateModel.js'; // Adjust path as per your project structure
import Attendance from '../../../models/attendenceModel.js'; // Adjust path as per your project structure
// import { insertAttendanceEntry } from './insertAttendanceEntry.js'; // Adjust path as per your project structure

export const attendance = async (req, res) => {
    const input = req.body;
console.log(input);

    if (!input.courseId || !input.icNo) {
        return res.status(400).json({ error: 'Not Enough Information' });
    }

    try { 
        const candidate = await Candidate.findOne({
            where: { ic_number: input.icNo }
        }); 
        const courseDetails = await Course.findOne({
            where: { course_id: input.courseId }
        });
        console.log(courseDetails,"courseDetails nnnnn");
        if (!courseDetails) {
            return res.status(400).json({ error: 'Course not available' });
        }

        const courseId = courseDetails.course_id;

        if (candidate) {
            const currentDate = new Date().toISOString().split('T')[0]; // Current date in ISO format

            const courseStartDate = new Date(courseDetails.start_date).toISOString().split('T')[0];
            const courseEndDate = new Date(courseDetails.end_date).toISOString().split('T')[0]; 
            if (currentDate >= courseStartDate && currentDate <= courseEndDate) {
                const result = await insertAttendanceEntry(candidate, input, courseStartDate, courseEndDate, courseDetails, courseId);
                return res.status(200).json(result);
            } else {
                return res.status(400).json({ error: 'Invalid entry' });
            }
        } else {
            return res.status(400).json({ error: 'Please enter valid IC number' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};


export const insertAttendanceEntry = async (candidate, input, sDate, eDate, courseDetails, courseId) => {
    try {
        console.log(candidate,"candidate");
        console.log(candidate.dataValues.candidate_id,"candidate_id");
        console.log(courseId,"courseId");

        const courseCandidate = await CourseCandidate.findOne({
            where: {
                course_id: courseId,
                candidate_id: candidate.dataValues.candidate_id
            },
            order: [['id', 'DESC']]
        });
        console.log(courseCandidate,"courseCandidate");


        if (!courseCandidate || courseCandidate.status !== 'approved') {
            throw new Error('Invalid details');
        }

        const attendance = new Attendance();
        attendance.candidate_id = candidate.candidate_id;
        attendance.course_id = courseId;
        attendance.attended = 'yes';
        attendance.attended_date = new Date().toISOString(); // Assuming you want current date/time

        if (await attendance.save()) {
            const endDate = eDate.toISOString().split('T')[0]; // Assuming eDate is a Date object
            const endDateWithTime = `${endDate} 23:59:59`;

            const attendanceCount = await Attendance.count({
                where: {
                    course_id: courseId,
                    candidate_id: candidate.candidate_id,
                    attended_date: {
                        [Sequelize.Op.between]: [sDate, endDateWithTime]
                    }
                }
            });

            courseCandidate.attended = (attendanceCount === courseDetails.days) ? 'yes' : 'partial';
            await courseCandidate.save();

            return { status: 'success' };
        } else {
            throw new Error('Attendance not saved');
        }
    } catch (error) {
        throw error;
    }
};

