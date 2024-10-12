import Course from './courseModel.js';
import CourseCandidate from './courseCandidateModel.js';
import Candidate from './candidateModel.js';
import Department from './departmentModel.js'; // Import Department model
import Attendance from './attendenceModel.js';
import CandidateEnrollment from './candidateEnrollmentModel.js';
import CourseEvaluation from './courseEvaluvation.js';


const initializeModels = (db) => {
    // Course and CourseCandidate
    CourseCandidate.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
    Course.hasMany(CourseCandidate, { foreignKey: 'course_id', as: 'courseCandidates' });

    // CourseCandidate and Candidate
    CourseCandidate.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
    Candidate.hasMany(CourseCandidate, { foreignKey: 'candidate_id', as: 'courseCandidates' });

    // Candidate and Department
    Candidate.belongsTo(Department, { foreignKey: 'ministry_id', as: 'candidateDepartment' });
    Department.hasMany(Candidate, { foreignKey: 'ministry_id', as: 'departmentCandidates' });

    // // CourseEvaluation and Course
    CourseEvaluation.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
    Course.hasMany(CourseEvaluation, { foreignKey: 'course_id', as: 'courseEvaluations' }); // Optional, for completeness

    // // CourseEvaluation and Candidate
    CourseEvaluation.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
    Candidate.hasMany(CourseEvaluation, { foreignKey: 'candidate_id', as: 'evaluations' }); // Optional, for completeness

    // // CandidateEnrollment and Candidate
   // Change the alias in the association
    Candidate.hasMany(CandidateEnrollment, { foreignKey: 'candidate_id', as: 'candidateEnrollments' });
    CandidateEnrollment.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'candidate' });

    // // Attendance and Course
    Attendance.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
    Course.hasMany(Attendance, { foreignKey: 'course_id', as: 'attendances' });

    // // Attendance and Candidate
    Attendance.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
    Candidate.hasMany(Attendance, { foreignKey: 'candidate_id', as: 'attendances' });
};



export default initializeModels;


export { Course, CourseCandidate, Candidate, Department, initializeModels };
