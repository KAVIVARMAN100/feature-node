import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const CourseCandidate = db.define('CourseCandidate', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    course_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    candidate_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    ministry_id: {
        type: DataTypes.BIGINT,
        allowNull: true // Set to true if this column can be null
    },
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending'
    },
    attended: {
        type: DataTypes.STRING(50),
        allowNull: true // Set to true if this column can be null
    }
}, {
    tableName: 'course_candidate_tb',
    timestamps: false
});

export default CourseCandidate;
