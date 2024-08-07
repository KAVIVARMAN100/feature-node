import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Login from '../models/loginModel.js'; // Adjust the import path as needed
import { where } from 'sequelize';

dotenv.config(); // Load environment variables

export const verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decoded,"decoded value");
      // Get user from the token
      req.user = await Login.findOne({
        user_id:decoded.id
      });
      if (!req.user) {
        return res.status(401).json({ error: true, message: "Unauthorized access" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: true, message: "Unauthorized access" });
    }
  } else {
    return res.status(401).send({
      error: true,
      message: "No token provided.",
    });
  }
};
