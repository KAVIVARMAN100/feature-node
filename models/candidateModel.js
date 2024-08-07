
// Import Sequelize and database connection
import { DataTypes } from 'sequelize';
import db from '../config/database.js';

// Define the Candidate model
const Candidate = db.define('candidate_tb', {
    candidate_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    candidate_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ic_number: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    dob: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    doj: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cemail_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    attended: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    ministry: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    department: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    position: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    salary_grade: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    date_created: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_updated: {
        type: DataTypes.DATE,
        allowNull: false
    },
    selected: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ipa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ministry_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'candidate_tb',
    timestamps: false // Set timestamps to false if date_created and date_updated are handled manually
});

export default Candidate;
