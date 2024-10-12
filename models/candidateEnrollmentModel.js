import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const CandidateEnrollment = db.define('CandidateEnrollment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    candidate_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    course_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'candidate_enrollment_tb',
    timestamps: false // Disable createdAt and updatedAt automatic fields
});

export default CandidateEnrollment;



