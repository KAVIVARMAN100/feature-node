
import CourseCandidate from '../../../models/courseCandidateModel.js';
import AppError from '../../../utils/AppError.js';
import Attendance from '../../../models/attendenceModel.js';


export const getCandidateAttendance = async (req, res, next) => {
  try {
    const { candidateId, courseId } = req.body;

    if (!candidateId || !courseId) {
      throw new AppException('Bad Request', 400, new Error('Not enough information'));
    }

    const courseCanDetails = await CourseCandidate.findOne({
      where: {
        candidate_id: candidateId,
        course_id: courseId,
        status: 'approved',
      },
    });     

    if (!courseCanDetails) {
      throw new Error('Candidate details not available');
    }

    const attendanceDetails = await Attendance.findAll({
      where: {
        candidate_id: candidateId,
        course_id: courseId,
        attended: 'yes',
      },
    });
console.log(attendanceDetails,"This is attendanceDetails");

    const attendanceData = attendanceDetails.length ? attendanceDetails : [];

    return res.json({ data: attendanceData });
  } catch (error) {
    next(error); // Passes the error to the error handling middleware
  }
};



