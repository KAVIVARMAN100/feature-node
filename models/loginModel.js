import { Sequelize } from "sequelize";
import db from "../config/database.js";
const { DataTypes } = Sequelize;

const Login = db.define('login_tb',{
    id:{
        autoIncrement:true,
        primaryKey:true,
        type:DataTypes.INTEGER,
    },
    user_id:{
        type: DataTypes.STRING
    },
    token:{
        type: DataTypes.STRING
    },
    dateCreated:{
        type: DataTypes.STRING
    },
    dateExpired:{
        type: DataTypes.STRING
    }    
},{
    freezeTableName:true,
    timestamps: false
});


export default Login;