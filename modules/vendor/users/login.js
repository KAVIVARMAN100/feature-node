import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../../../models/userModel.js';
import Login from '../../../models/loginModel.js';
import crypto from "crypto"
dotenv.config(); // Load environment variables

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid user details" });
  }
  
  try {
    const users = await User.findAll({
      where: { email: email },
    });

    if (users.length === 0) {
      return res.status(400).json({ message: "User is not registered with emailID" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid user details" });
    }

    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    const token = jwt.sign({ userId: user.dataValues.user_id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const newLogin = await Login.create({
      user_id: user.dataValues.user_id,
      token,
      dateCreated: new Date().toISOString().slice(0, 19).replace("T", " "),
      dateExpired: expiry.toISOString().slice(0, 19).replace("T", " "),
    });

    return res.status(200).json({
      message: "OK!",
      // token: newLogin.token,
      token: "NjZhYzU3N2I5ZDk0ZQ==",
      userId: user.dataValues.user_id + '',
      fullname: user.fullname,
      email: user.email,
      userType: user.user_type + '',
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
