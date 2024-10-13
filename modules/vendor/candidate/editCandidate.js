import Candidate from '../../../models/candidateModel.js';
import CourseCandidate from '../../../models/courseCandidateModel.js';
import User from '../../../models/userModel.js';
import Course from '../../../models/courseModel.js';
import AppError from '../../../utils/AppError.js';
import CandidateEnrollment from '../../../models/candidateEnrollmentModel.js';
import { Op } from 'sequelize';



export const editCandidate = async (req, res) => {
    try {
        const input = req.body;

        const requiredFields = [
            'candidateId', 'candidateName', 'icNo', 'candidateType', 'email', 'mobileNo',
            'doj', 'dob', 'gender', 'ministry', 'dept', 'position', 'salaryGrade',
            'courseId', 'ministryId' , 'userId'
        ];

        for (const field of requiredFields) {
            if (!input[field]) {
                return res.status(400).json({ message: `Missing field: ${field}` });
            }
        }

        const candidate = await Candidate.findByPk(input.candidateId);
        if (!candidate) {
            throw new AppError('Candidate not available', 404);
        }

        if (input.userId) {
            const user = await User.findByPk(input.userId);
            console.log(user,"user detsila");
            
            if (user) {
                if (user.user_type !== 115) {
                    // Update conditions based on user type if needed
                }
            } else {
                throw new AppError('User not found', 400);
            }
        }

        // Update candidate
        candidate.user_id = input.userId;
        candidate.candidate_name = input.candidateName;
        candidate.ic_number = input.icNo;
        candidate.type = input.candidateType;
        candidate.dob = input.dob;
        candidate.doj = input.doj;
        candidate.gender = input.gender;
        candidate.cemail_id = input.email;
        candidate.phone_number = input.mobileNo;
        candidate.attended = input.attended;
        candidate.ministry = input.ministry;
        candidate.department = input.dept;
        candidate.position = input.position;
        candidate.salary_grade = input.salaryGrade;

        await candidate.save();

        // Fetch updated candidate details
        const updatedCandidate = await fetchCandidate(input.courseId, input.ministryId);
        console.log(updatedCandidate,"This is updatedCandidate");
        
        res.json(updatedCandidate);

    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    }
};

const clashDateValidate = async (input, newCandidate) => {
    console.log('New Candidate:', newCandidate);

    const course = await Course.findByPk(input.courseId);
    console.log('Course Details:', course);

    if (!course) {
        throw new Error('Course not found');
    }
    
    const { start_date: startDate, end_date: endDate, session } = course;
    console.log('Course Start Date:', startDate, 'Course End Date:', endDate);

    // Check for course clashes
    const courseDetails = await CourseCandidate.findAll({
        include: [
            {
                model: Course,
                as: 'course',
                // where: {
                //     [Op.or]: [
                //         {
                //             start_date: { [Op.lte]: endDate },
                //             end_date: { [Op.gte]: startDate }
                //         }
                //     ]
                // }
            }
        ],
        // where: {
        //     candidate_id: newCandidate.candidate_id,
        //     status: 'approved'
        // }
    });
    console.log('Course Details Found:', courseDetails);

    // Check for previous attendance
    const preAttended = await CourseCandidate.findOne({
        include: [
            {
                model: Course,
                as: 'course',
                where: {
                    uid: course.uid,
                    end_date: { [Op.lt]: new Date() }
                }
            }
        ],
        // where: {
        //     candidate_id: newCandidate.candidate_id,
        //     attended: 'yes'
        // },
        order: [['course.end_date', 'DESC']]
    });
    console.log('Previous Attendance:', preAttended);

    let clashRecords = [];

    if (courseDetails && courseDetails.length > 0) {
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



export const addCandidateForApproval = async (req, res) => {
    try {
        const input = req.body;

        if (
            input.candidateName &&
            input.icNo &&
            input.candidateType &&
            input.email &&
            input.mobileNo &&
            input.doj &&
            input.dob &&
            input.gender &&
            input.position &&
            input.salaryGrade
        ) {
            // Check if the candidate already exists
            const candidate = await Candidate.findOne({ where: { ic_number: input.icNo } });

            if (candidate) {
                const response = await addCourseForSelf(candidate, input.courseId);
                return res.json(response);
            }

            // Create a new candidate
            const newCandidate = await Candidate.create({
                candidate_name: input.candidateName,
                ic_number: input.icNo,
                type: input.candidateType,
                cemail_id: input.email,
                phone_number: input.mobileNo,
                dob: input.dob,
                doj: input.doj,
                position: input.position,
                salary_grade: input.salaryGrade,
                gender: input.gender,
            });

            if (newCandidate) {
                const response = await addCourseForSelf(newCandidate, input.courseId);
                return res.json(response);
            } else {
                throw new Error('Candidate details not saved');
            }
        } else {
            res.status(400).json({ message: 'Not enough information' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const selfCandidateDetails = async (req, res) => {
    try {
        const courseId = req.query.id;
        if (!courseId) {
            return res.status(400).json({ message: 'Bad Request: Not enough information' });
        }
        const candidateDetails = await Candidate.findAll({
            include: [
                {
                    model: CandidateEnrollment,
                    as: 'candidateEnrollments',  // Changed alias to match the association
                    where: { course_id: courseId },
                    attributes: []
                }
            ],
            attributes: ['ic_number', 'candidate_id', 'candidate_name', 'position', 'salary_grade']
        });
        const selfEnrollmentCount = await CandidateEnrollment.count({
            where: { course_id: courseId }
        }); 
        return res.json({ data: candidateDetails, count: selfEnrollmentCount });
    } catch (error) {
        console.error('Error in selfCandidateDetails:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
 

export const addCourseCandidateDetail = async (input, newCandidate) => {
    try {
        const courseCandidate = await CourseCandidate.create({
            course_id: input.courseId,
            candidate_id: newCandidate.candidate_id,
            ministry_id: input.ministryId,
            status: 'pending'
        });

        return courseCandidate; // Return the created instance if needed
    } catch (error) {
        console.error('Error creating CourseCandidate:', error);
        throw new AppError('Failed to add course candidate detail', 500, error.message);
    }
};



export const updateSelfEnrollment = async (req, res) => {
    try {
        console.log("Entering updateSelfEnrollment");

        const input = req.body;
        console.log(input, "Received input for updateSelfEnrollment");

        // Validate input
        const requiredFields = ['courseId', 'icNo', 'ministryId', 'departmentId', 'ministry'];
        const missingFields = requiredFields.filter(field => !input[field]);

        if (missingFields.length) {
            return res.status(400).json({ message: `Bad Request: Missing fields: ${missingFields.join(', ')}` });
        }

        const candidate = await Candidate.findOne({ where: { ic_number: input.icNo } });
        console.log(candidate, "Retrieved candidate");

        if (!candidate) {
            throw new Error('Candidate not available');
        }

        // Update candidate details
        candidate.ministry = input.ministry;
        candidate.department = input.departmentId;
        await candidate.save();

        const courseCandidateEntry = await CourseCandidate.findOne({
            where: {
                candidate_id: candidate.candidate_id,
                course_id: input.courseId
            }
        });
        console.log(courseCandidateEntry, "Course candidate entry");

        if (courseCandidateEntry) {
            throw new Error('This candidate is already added to this course');
        }
console.log(input, candidate,"this is input, candidate");

        const clashDateDetails = await addCourseCandidateDetail(input, candidate);
        if (typeof clashDateDetails === 'object' && clashDateDetails.clashDate) {
            return res.json(clashDateDetails);
        }

        const candidateEnrollment = await CandidateEnrollment.findOne({
            where: {
                candidate_id: candidate.candidate_id,
                course_id: input.courseId
            }
        });

        if (candidateEnrollment) {
            await candidateEnrollment.destroy();
        }

        const candidateDetails = await Candidate.findAll({
            include: [{
                model: CandidateEnrollment,
                as: 'candidateEnrollments',
                where: { course_id: input.courseId },
                attributes: []
            }],
            attributes: ['ic_number', 'candidate_id', 'candidate_name', 'position', 'salary_grade']
        });

        const selfEnrollmentCount = await CandidateEnrollment.count({
            where: { course_id: input.courseId }
        });

        return res.json({ data: candidateDetails, count: selfEnrollmentCount });
    } catch (error) {
        console.error('Error in updateSelfEnrollment:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



// Helper function to add course for the candidate
export const addCourseForSelf = async (candidate, courseId) => {
    try {
        // Check if the candidate is already enrolled or nominated for this course
        const courseCanDetails = await CourseCandidate.findOne({
            where: {
                candidate_id: candidate.dataValues.candidate_id,
                course_id: courseId,
            }
        });

        if (courseCanDetails) {
            return { msg: 'You are already nominated for this course', status: true };
        }

        const recordExists = await CandidateEnrollment.findOne({
            where: {
                candidate_id: candidate.candidate_id,
                course_id: courseId,
            }
        });

        if (recordExists) {
            return { msg: 'Already enrolled for this course and waiting for approval' };
        }

        // Create a new enrollment record
        const candidateEnrollment = await CandidateEnrollment.create({
            candidate_id: candidate.candidate_id,
            course_id: courseId,
            created_at: new Date().toISOString(),
        });

        if (candidateEnrollment) {
            return { msg: 'Candidate enrolled successfully' };
        } else {
            throw new Error('Record not saved');
        }
    } catch (error) {
        throw new Error(error.message);
    }
};


const fetchCandidate = async (courseId, ministryId) => {
    try {
        const candidates = await CourseCandidate.findAll({
            include: [
                {
                    model: Candidate,
                    as: 'candidate',
                    required: true
                }
            ],
            where: {
                course_id: courseId,
                ministry_id: ministryId
            }
        }); 
        return {
            data: candidates.map(candidate => candidate.candidate)
        };
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return { data: [] };
    }
};

