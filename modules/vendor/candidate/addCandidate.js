import Candidate from '../../../models/candidateModel.js';
import CourseCandidate from '../../../models/courseCandidateModel.js';
import User from '../../../models/userModel.js';
import Course from '../../../models/courseModel.js';
import { Op } from 'sequelize';
import AppError from '../../../utils/AppError.js';

const clashDateValidate = async (input, newCandidate) => {
    console.log("enters into clashDateValidate");

    const course = await Course.findByPk(input.courseId);
    console.log('Course Details:', course);

    if (!course) {
        throw new AppError('Course not found', 404);
    }

    const { start_date: startDate, end_date: endDate, session } = course;
    console.log('Course Start Date:', startDate, 'Course End Date:', endDate);

    // Check for course clashes
    const courseDetails = await CourseCandidate.findAll({
        include: [
            {
                model: Course,
                as: 'course',
                attributes: ['session', 'start_date', 'end_date'] // Ensure necessary fields are selected
            }
        ],
        where: {
            candidate_id: newCandidate.candidate_id, // Make sure this ID exists in CourseCandidate
        }
    });
    
    if (!courseDetails || courseDetails.length === 0) {
         return {
            clashDate: false,
            data: [],
            preAttended: []
        };
    } 
    // Check for previous attendance
    const preAttended = await CourseCandidate.findOne({
        include: [
            {
                model: Course,
                as: 'course',
                where: {
                    uid: course.uid,
                    end_date: { [Op.lt]: new Date() }
                },
                attributes: ['end_date'] // Add the necessary attributes
            }
        ],
        where: {
            candidate_id: newCandidate.candidate_id,
            // Optionally add condition like attended: 'yes'
        },
        order: [['course', 'end_date', 'DESC']]
    });

    if (courseDetails.length > 0) {
        clashRecords = courseDetails.filter(record =>
            session === 'full' || record.course.session === 'full' || record.course.session === session
        );
    }

    return {
        clashDate: clashRecords.length > 0 || preAttended !== null,
        data: clashRecords,
        preAttended: preAttended ? [preAttended] : []
    };
};


  export const addCandidate = async (req, res, next) => {
    const input = req.body;

    try {
        if (
            input.candidateName &&
            input.icNo &&
            input.candidateType &&
            input.email &&
            input.mobileNo &&
            input.doj &&
            input.dob &&
            input.gender &&
            input.attended &&
            input.ministry &&
            input.dept &&
            input.position &&
            input.salaryGrade &&
            input.courseId &&
            input.ipaId &&
            input.ministryId
        ) {
            let condition = { candidate_id: input.candidateId };
            let userTypeId;

            if (input.userId) {
                const user = await User.findOne({ where: { user_id: input.userId } });
                console.log(user,"this is user");

                if (user) {
                    userTypeId = user.user_type;
                    console.log(userTypeId,"This is usertype");                    
                } else {
                    throw new AppError('Bad Request', 400, 'Not enough information');
                }
            }

            if (userTypeId !== 115) {
                condition.course_id = input.courseId;
            }

            const candidate = await Candidate.findOne({ where: { ic_number: input.icNo } });
console.log(condition,"condition is from condition");
console.log(candidate,"candidate is from db");

            if (candidate) {
                const courseCandidateEntry = await CourseCandidate.findOne({
                    where: condition,
                });
console.log(courseCandidateEntry,"This is courseCandidateEntry");

                if (!courseCandidateEntry) {
                    await addCourseCandidateDetail(input, candidate);
                    const result = await fetchCandidate(input.courseId, input.ministryId);
                    return res.json(result);
                } else {
                    throw new AppError('This candidate is already added to this course', 400);
                }
            } else {
                console.log("entrering in to else");
                
                const newCandidate = await Candidate.create({
                    candidate_name: input.candidateName,
                    ic_number: input.icNo,
                    type: input.candidateType,
                    cemail_id: input.email,
                    phone_number: input.mobileNo, // Ensure this matches the type in the model
                    attended: input.attended,
                    ministry: input.ministry,
                    dob: input.dob,
                    doj: input.doj,
                    department: input.dept,
                    position: input.position,
                    salary_grade: input.salaryGrade,
                    selected: 'pending',
                    course_id: input.courseId,
                    ipa_id: input.ipaId,
                    ministry_id: input.ministryId,
                    gender: input.gender,
                });
                console.log("New Candidate Created:", newCandidate);

                if (newCandidate) {
                    const mailDetails = {
                        to: input.email,
                        subject: 'Registration successful',
                        name: input.candidateName,
                        message: 'Your account has been successfully registered.',
                    };
                    console.log(mailDetails,"This is the mail details");
                    
                    // Uncomment and configure mail sending
                    // const mail = new Mail();
                    // await mail.sendMail(mailDetails);

                    await addCourseCandidateDetail(input, newCandidate);
                    const result = await fetchCandidate(input.courseId, input.ministryId);
                    return res.json(result);
                } else {
                    throw new AppError('Candidate creation failed', 500);
                }
            }
        } else {
            throw new AppError('Bad Request', 400, 'Not Enough Information');
        }
    } catch (error) {
        console.error('Error Details:', error);
        next(error);
    }
};


const addCourseCandidateDetail = async (input, newCandidate) => {
    console.log(input, newCandidate,"its entering here");
    
    const clashDateResult = await clashDateValidate(input, newCandidate);
    console.log(clashDateResult,"clashDateResult");
    
    if (clashDateResult.clashDate) {
        return clashDateResult;
    }

    await CourseCandidate.create({
        course_id: input.courseId,
        candidate_id: newCandidate.candidate_id,
        ministry_id: input.ministryId,
        status: 'pending'
    });

    return { clashDate: false };
};

const fetchCandidate = async (courseId, ministryId) => {
    const candidates = await CourseCandidate.findAll({
        include: [
            {
                model: Candidate,
                as: 'candidate',
                required: true
            }
        ],
        where: { course_id: courseId }
    });

    return {
        data: candidates.map(candidate => candidate.candidate)
    };
};
