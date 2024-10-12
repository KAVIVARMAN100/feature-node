import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Attendance = db.define('attendance_tb', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    attended: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    attended_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    attended_time: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: 'attendance_tb',
    timestamps: false
});

export default Attendance;
