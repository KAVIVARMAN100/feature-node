import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config();


const db = new Sequelize('rhymin','KAVIVARMAN B','Fifty625@',{
    host: "DESKTOP-6TT3GC7",
    dialect: "mysql",
    logging: console.log, 
});

 
export default db;