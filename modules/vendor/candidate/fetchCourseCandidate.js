import Course from '../../../models/courseModel.js';
import CourseCandidate from '../../../models/courseCandidateModel.js';
import Candidate from '../../../models/candidateModel.js';
import Department from '../../../models/departmentModel.js';
import AppError from '../../../utils/AppError.js';
import CandidateEnrollment from '../../../models/candidateEnrollmentModel.js';


export const fetchCourseCandidate = async (req, res, next) => {
  try {
    const courseId = req.query.courseId;

    if (!courseId) {
      throw new AppError('Bad Request', 400, new Error('Not Enough Information'));
    }

    // Test without include
    const course = await Course.findOne({
      where: { course_id: courseId }
    });
console.log(course,"This is the course");

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Test with include
    const results = await Course.findAll({
      include: [
        {
          model: CourseCandidate,
          as: 'courseCandidates', // Ensure alias matches association definition
          attributes: ['status', 'attended'],
          include: [
            {
              model: Candidate,
              as: 'candidate', // Ensure alias matches association definition
              attributes: ['candidate_id', 'department_id', 'candidate_name']
            }
          ]
        }
      ],
      where: {
        course_id: courseId
      }
    });

    // Convert the results to plain objects for response
    const report = results.map(course => ({
      ...course.toJSON(),
      courseCandidates: course.courseCandidates.map(courseCandidate => ({
        ...courseCandidate.toJSON(),
        candidate: courseCandidate.candidate ? courseCandidate.candidate.toJSON() : null
      }))
    }));

    return res.json({ data: report });

  } catch (error) {
    next(error);
  }
};




export const fetchCandidate = async (req, res, next) => {
  console.log("Entering fetchCandidate function...");

  try {
    // Retrieve query parameters
    const userId = req.query.user_id;
    const courseId = req.query.courseId;
    const userType = req.query.userType;

    // Log query parameters for debugging
    console.log("Received query params:", { userId, courseId, userType });

    // Check for required query parameters
    if (!userId || !courseId || !userType) {
      console.log("Missing parameters:", { userId, courseId, userType });
      return res.status(400).json({ message: 'Bad Request: Not Enough Information' });
    }

    // Base query for fetching candidates
    const query = {
      include: [
        {
          model: CourseCandidate,
          as: 'courseCandidates',
          attributes: ['status', 'attended'],
          where: { course_id: courseId },
        },
      ],
      where: {},
    };
console.log(query,"This is the query");

    // Add conditions based on userType
    if (userType === '100') {
      query.where.user_id = userId;
    } else if (userType >= '101' && userType <= '113') {
      query.include[0].where.ministry_id = userId;
    } else if (userType !== '114') {
      console.log("Invalid userType:", userType);
      return res.status(400).json({ message: 'Bad Request: Invalid user type' });
    }
    console.log(query,"This is the query");

    // Fetch candidates with the constructed query
    const candidates = await Candidate.findAll(query);

    // Convert the result to JSON
    const candidateDetails = candidates.map(candidate => candidate.toJSON());

    return res.json({
      data: {
        courseDetails: {},
        candidateDetail: candidateDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    next(error);
  }
};






