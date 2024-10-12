import CandidateEnrollment from '../../../models/candidateEnrollmentModel.js';
import Candidate from '../../../models/candidateModel.js';
import AppError from '../../../utils/AppError.js';
import Course from '../../../models/courseModel.js';
import CourseCandidate from '../../../models/courseCandidateModel.js';
import CourseEvaluation from '../../../models/courseEvaluvation.js';
import EvaluationQuestions from '../../../models/evaluvationQuestion.js';


export const deleteSelfEnrollment = async (req, res, next) => {
  try {
    const { courseId, candidateId } = req.body;

    if (!courseId || !candidateId) {
      throw new AppError('Bad Request', 400, new Error('Not enough information'));
    }

    const candidateEnrollment = await CandidateEnrollment.findOne({
      where: {
        candidate_id: candidateId,
        course_id: courseId,
      },
    }); 
    if (candidateEnrollment) {
      const deleteResult = await candidateEnrollment.destroy();
    if (deleteResult) {
        const candidateDetails = await Candidate.findAll({
          attributes: [
            'ic_number',
            'candidate_id',
            'candidate_name',
            'position',
            'salary_grade',
          ],
          include: [{
            model: CandidateEnrollment,
            as: 'candidateEnrollments', // Use the alias here
            where: { course_id: courseId },
            attributes: [], // We don't need attributes from CandidateEnrollment
          }],
        });

        const selfEnrollmentCount = await CandidateEnrollment.count({
          where: { course_id: courseId },
        });
 
        return res.json({
          data: candidateDetails,
          count: selfEnrollmentCount,
        });
      } else {
        throw new Error('Candidate not rejected');
      }
    } else {
      throw new Error('Error occurred on server');
    }
  } catch (error) {
    next(error); // Passes the error to the error handling middleware
  }
};

 
export const saveCourseEvaluation = async (req, res) => {
    try {
        const input = req.body;

        // Check for required input fields
        if (!input.courseId || !input.icNo) {
            return res.status(400).json({ message: 'Bad Request: Not enough information' });
        }

        // Find candidate by icNo
        const candidate = await Candidate.findOne({ where: { ic_number: input.icNo } });
        const courseDetails = await Course.findOne({ where: { course_id: input.courseId } });

        if (!courseDetails || !candidate) {
            const title = !courseDetails ? 'Course' : 'Candidate';
            return res.status(400).json({ message: `${title} not available` });
        }

        const courseId = courseDetails.course_id;
        const candidateId = candidate.candidate_id;

        // Check if candidate is approved for the course
        const courseCanDetails = await CourseCandidate.findOne({
            where: {
                candidate_id: candidateId,
                course_id: courseId,
                status: 'approved'
            }
        });

        if (!courseCanDetails) {
            return res.status(400).json({ message: 'Candidate details not available' });
        }

        // Check if the candidate has already submitted an evaluation for the course
        const courseEvaluationExists = await CourseEvaluation.findOne({
            where: { course_id: courseId, candidate_id: candidateId }
        });

        if (courseEvaluationExists) {
            return res.status(400).json({ message: 'Already evaluated' });
        }

        // Create and save the course evaluation
        const courseEvaluation = await CourseEvaluation.create({
            course_id: courseId,
            candidate_id: candidateId,
            first_question: input.firstQuestion,
            second_question: input.secondQuestion,
            third_question: input.thirdQuestion,
            fourth_question: input.fourthQuestion,
            fifth_question: input.fifthQuestion,
            comments: input.comments,
            create_date: new Date().toISOString() // Current timestamp
        });

        if (courseEvaluation) {
            return res.json({ status: true, msg: 'Evaluation saved successfully' });
        } else {
            throw new Error('Course Evaluation not saved properly');
        }
    } catch (error) {
        console.error('Error in saveCourseEvaluation:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

 
export const getCourseEvaluation = async (req, res) => {
    try {
        const courseId = req.query.courseId;
        if (!courseId) {
            return res.status(400).json({ message: 'Bad Request: Not enough information' });
        }
        // Fetch the evaluation questions
        const questions = await EvaluationQuestions.findOne(); 
        if (!questions) {
            return res.status(400).json({ message: 'Data not available' });
        }

        // Fetch the course evaluations along with candidate details
        const evaluationDetails = await CourseEvaluation.findAll({
            where: { course_id: courseId },
            include: [
                {
                    model: Candidate,
                    as: 'candidate',
                    attributes: ['candidate_name', 'ic_number']
                }
            ],
            attributes: [
                'first_question',
                'second_question',
                'third_question',
                'fourth_question',
                'fifth_question',
                'comments',
                'create_date'
            ]
        }); 
        if (!evaluationDetails || evaluationDetails.length === 0) {
            return res.status(400).json({ message: 'Data not available' });
        }
        return res.json({ evaluationDetails, questions });
    } catch (error) {
         return res.status(500).json({ message: 'Internal Server Error' });
    }
};


