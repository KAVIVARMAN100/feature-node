import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Candidate = db.define('Candidate', {
    candidate_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    candidate_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ic_number: {
        type: DataTypes.STRING(8),
        allowNull: true,
        unique: true
    },
    dob: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    doj: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    cemail_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING, // Changed from INTEGER to STRING
        allowNull: true
    },
    attended: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    ministry: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    department: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    position: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    salary_grade: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    date_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    date_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    selected: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ipa_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ministry_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false, // Disable Sequelize's default createdAt and updatedAt
    tableName: 'candidate_tb' // Ensure the table name matches your actual table name
});

export default Candidate;
