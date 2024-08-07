import { Op } from 'sequelize';
import CourseCandidate from '../../../models/courseCandidateModel.js'
import Course from '../../../models/courseModel.js';
import CandidateStatusMsg from '../../../models/candidatemsgModel.js';
import User from '../../../models/userModel.js';

export const enrollment = async (req, res) => {
  const input = req.body;

  if (input.userId && input.candidateId && input.courseId && input.status) {
    try {
      const updateCandidate = await CourseCandidate.findOne({
        where: {
          candidate_id: input.candidateId,
          course_id: input.courseId
        }
      });

      if (updateCandidate) {
        return updateCandidateData(updateCandidate, input, res);
      } else {
        return res.status(404).send({ error: 'Candidate not found' });
      }
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(400).send({ error: 'Bad Request: Not enough information' });
  }
};

const checkClashDate = async (input, candidate) => {
  const result = { clashDate: false };
  const courseResult = { clashDate: false };

  const course = await Course.findOne({ where: { course_id: input.courseId } });
  if (!course) {
    throw new Error('Course not found');
  }

  const startDate = course.start_date;
  const endDate = course.end_date;

  // Query for course details that clash with the given dates
  const courseDetails = await CourseCandidate.findAll({
    where: {
      candidate_id: candidate.candidate_id,
      status: 'approved',
      [Op.or]: [
        {
          [Op.and]: [
            { '$course.start_date$': { [Op.lte]: startDate } },
            { '$course.end_date$': { [Op.gte]: startDate } }
          ]
        },
        {
          [Op.and]: [
            { '$course.start_date$': { [Op.gte]: startDate } },
            { '$course.start_date$': { [Op.lte]: endDate } }
          ]
        }
      ]
    },
    include: [{
      model: Course,
      as: 'course',
      attributes: ['course_name', 'start_date', 'end_date', 'session']
    }]
  });

  // Query for previously attended courses
  const preAttended = await CourseCandidate.findOne({
    where: {
      candidate_id: candidate.candidate_id,
      attended: 'yes',
      '$course.uid$': course.uid,
      '$course.end_date$': { [Op.lt]: new Date() }
    },
    include: [{
      model: Course,
      as: 'course',
      attributes: ['course_name', 'start_date', 'end_date', 'uid']
    }],
    order: [['course', 'end_date', 'DESC']],
    limit: 1
  });

  if (courseDetails.length > 0) {
    const clashRecords = courseDetails.filter(record => {
      return course.session === 'full' || record.course.session === 'full' || record.course.session === course.session;
    });

    if (clashRecords.length > 0) {
      courseResult.clashDate = true;
      courseResult.data = clashRecords;
    }
  }

  if (preAttended) {
    courseResult.clashDate = true;
    courseResult.preAttended = preAttended;
  }

  return courseResult.clashDate ? courseResult : result;
};

const updateCandidateData = async (updateCandidate, input, res) => {
  try {
    if (input.status === 'approved' ) {
      const clashDateResult = await checkClashDate(input, updateCandidate);
      if (clashDateResult.clashDate) {
        return res.status(409).send(clashDateResult);
      }
    }

    updateCandidate.status = input.status;
    const result = await updateCandidate.save();

    if (input.status !== 'approved' && input.msg) {
      const candidateStatusMsg = CandidateStatusMsg.build({
        candidate_id: updateCandidate.candidate_id,
        course_id: updateCandidate.course_id,
        status: input.status,
        message: input.msg,
        user_id: input.userId,
        created_at: new Date().toISOString().replace('T', ' ').substr(0, 19) // Formatting to 'Y-m-d H:i:s'
      });
      await candidateStatusMsg.save();
    }

    if (result) {
      const courseId = parseInt(input.courseId, 10);

      const countResult = await CourseCandidate.count({
        where: {
          status: 'approved',
          course_id: courseId
        }
      });

      return updateConfirmedSeat(countResult, input, res);
    } else {
      throw new Error('Candidate not updated');
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateConfirmedSeat = async (count, input, res) => {
  const userId = parseInt(input.userId, 10);
  let conditions = { course_id: input.courseId };
  let user = await User.findOne({ where: { user_id: userId } });

  if (!user) {
    return res.status(400).send({ error: 'Not enough information' });
  }

  if (user.user_type !== 115) {
    conditions.user_id = userId;
  }

  const course = await Course.findOne({ where: conditions });

  if (course) {
    course.confirmed_seat = count;
    const result = await course.save();

    if (result) {
      sendMail(input, res);
      return res.send({ message: 'Enrollment updated successfully', confirmedSeat: count });
    } else {
      throw new Error('Confirm seat is not updated');
    }
  } else {
    return res.status(404).send({ error: 'Course not found' });
  }
};

const sendMail = (input, res) => {
  // Implement the logic to send email
  // This is just a placeholder
  console.log('Sending email to:', input);
};

