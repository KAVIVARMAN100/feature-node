
import Department from '../../../models/departmentModel.js';
import User from '../../../models/userModel.js';

export const fetchMinistryDepartmentRelationship = async (req, res) => {    
    try {
        const userId = req.query.user_id;
        let usertypeId = req.query.user_type;  
        if (userId) {
            const user = await User.findOne({ where: { user_id: userId } });   
             const typeId = parseInt(user.dataValues.user_type);

            if ((typeId >= 101 && typeId <= 113) || typeId === 115 || typeId === 114) {
                const departments = await Department.findAll({
                    attributes: ['department_id', 'department_name'],
                    where: { ministry_id: typeId }
                });
                const report = departments.map(department => department.toJSON());
                res.json({ data: report });
            } else {
                res.json('Bad Request', 400, 'Invalid ID');
            }
        } else {
            res.json({ data: [] });
        }
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
