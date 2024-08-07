import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const User = db.define('user_tb', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_created: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    date_updated: {
        type: DataTypes.DATE,
        allowNull: true,       
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true, 
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default User;
