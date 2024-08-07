import Course from './courseModel.js';
import CourseCandidate from './courseCandidateModel.js';

const initializeModels = (db) => {
    Course.hasMany(CourseCandidate, { foreignKey: 'course_id', as: 'courseCandidates',onDelete:'NO ACTION' });

    CourseCandidate.belongsTo(Course, { foreignKey: 'course_id', as: 'course' })
};

export { Course, CourseCandidate, initializeModels };
