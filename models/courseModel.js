import { DataTypes } from 'sequelize';
import db from '../config/database.js';


const Course = db.define('course_tb', {
    course_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    course_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    uid: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    ucid: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    lastDateForNom: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    session: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    days: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    descriptions: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    class_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    instructors: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    confirmed_seat: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    internal_notes: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    attachment: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subcategory_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: 'course_tb',
    timestamps: false,
});



export default Course;
