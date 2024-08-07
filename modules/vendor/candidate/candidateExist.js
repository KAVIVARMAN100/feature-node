// services/candidateService.js

import Candidate from '../../../models/candidateModel.js';
import AppError from '../../../utils/AppError.js';
import Department from '../../../models/departmentModel.js';


export const candidateExist = async (req, res) => {
    try {
        const icNo = req.query.icno;

        if (!icNo) {
            throw new AppError('IC number is required', 400);
        }

        // Find candidate by IC number
        const candidate = await Candidate.findOne({
            where: { ic_number: icNo }
        });

        if (candidate) {
            // Find department associated with the candidate
            const department = await Department.findOne({
                where: { department_id: candidate.department }
            });

            res.json({
                isExist: true,
                candidate: candidate.toJSON(),
                department_name: department ? department.department_name : ''
            });
        } else {
            res.json({ isExist: false });
        }
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
