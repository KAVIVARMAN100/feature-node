import Course from '../../../models/courseModel.js';
import CourseCandidate from '../../../models/courseCandidateModel.js';
import Candidate from '../../../models/candidateModel.js';
import Department from '../../../models/departmentModel.js';
import AppError from '../../../utils/AppError.js';
import CandidateEnrollment from '../../../models/candidateEnrollmentModel.js';


 
export const fetchCourseCandidate = async (req, res, next) => {
    const courseId = req.query.courseId;

    try {
        if (!courseId) {
            throw new AppError('Bad Request', 400, 'Not Enough Information');
        }

        const result = await CourseCandidate.findAll({
            attributes: ['status', 'attended'], // Fetch only required fields from CourseCandidate
            include: [
                {
                    model: Candidate, // Join with the Candidate model
                    as: 'candidate',
                    attributes: { exclude: ['password'] } // Adjust fields as necessary
                },
                {
                    model: Course, // Join with the Course model
                    as: 'course',
                    where: { course_id: courseId },
                    attributes: []
                }
            ]
        }); 
        const report = result.length ? result : [];
        return res.json({ data: report });
    } catch (error) {
        console.error('Error fetching course candidates:', error);
        next(error);
    }
};


 
export const fetchCandidate = async (courseId, userId) => {
  try {
     
    if (!courseId || !userId) {
          throw new AppError('Invalid courseId or userId', 400);
      }
console.log(courseId, userId,"courseId, userId");

      // Use Sequelize to find candidates for the course and ministry
      const candidates = await CourseCandidate.findAll({
          attributes: ['status', 'attended'], // Select specific fields from CourseCandidate
          include: [
              {
                  model: Candidate, // Join with Candidate model
                  as: 'candidate',
                  attributes: { exclude: ['password'] } // Exclude password or other sensitive fields
              }
          ],
          where: {
              course_id: courseId,    // Matching courseId
              ministry_id: userId     // Matching userId (ministryId)
          }
      });

      // Convert results into the required format
      let candidateResult = [];
      if (candidates && candidates.length > 0) {
          candidates.forEach(candidate => {
              candidateResult.push({ candidate: candidate.toJSON() });
          });
      }

      // Return the formatted data
      return { data: candidateResult };
  } catch (error) {
      console.error('Error fetching candidates:', error);
      throw new AppError('Failed to fetch candidates', 500, error.message);
  }
};









