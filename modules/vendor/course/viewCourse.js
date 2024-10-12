 import Course from '../../../models/courseModel.js'; 
import User from '../../../models/userModel.js'; 
import CourseCandidate from '../../../models/courseCandidateModel.js'
import { fn, col } from 'sequelize';



export const viewCourse = async (req, res) => {
  const userId = req.query.user_id;
  const isAll = req.query.is_all;
  const catId = req.query.catId;
  let usertypeId = "";
  let course = [];

  if (userId) {
    try {
      const user = await User.findOne({ where: { user_id: userId } });
      console.log(user,"user details");
      if (user) {
        usertypeId = user.dataValues.user_type;
        if (usertypeId === '115') {
          usertypeId = isAll === 'all' ? '101' : '100';
        } else {
          usertypeId = isAll === 'all' ? '101' : usertypeId;
        }

        let queryOptions = {
          attributes: [
            'course_id',
            'user_id',
            [fn('COUNT', col('courseCandidates.course_id')), 'total']
          ],
          include: [{
            model: CourseCandidate,
            as: 'courseCandidates',
            attributes: [],
            required: false,
          }],
          group: ['course_tb.course_id'],
          order: [['course_id', 'DESC']],
        };

        if (usertypeId === '100') {
          queryOptions.where = {
            user_id: userId,
            is_deleted: false,
          };

          if (catId) {
            queryOptions.where.subcategory_id = catId;
          }

        } else if (usertypeId >= '101' && usertypeId <= '113' || usertypeId === '114') {
          queryOptions.where = { is_deleted: false };

          if (catId) {
            queryOptions.where.subcategory_id = catId;
          }
        } else {
          return res.status(400).json({ error: 'Invalid user type.' });
        }
        
        course = await Course.findAll(queryOptions);
        return res.json({ data: course });
      } else {
        return res.status(400).json({ error: 'Not enough information' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.json({ data: [] });
  }
};

 


