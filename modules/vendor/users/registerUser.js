import User from "../../../models/userModel.js"
import bcrypt from 'bcrypt';


export const register = async (req, res) => {
    const { fullname, phoneNumber, email, password, confirmPassword, userType } = req.body;

    if (
        fullname &&
        phoneNumber &&
        email &&
        password &&
        confirmPassword &&
        userType
    ) {
        if (password === confirmPassword) {
            const findEmail = await User.findOne({ where: { email } });

            if (findEmail) {
                return res.status(400).json({ error: 'Email is taken. Please choose another email.' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await User.create({
                    fullname,
                    phone_number: phoneNumber,
                    password: hashedPassword,
                    email,
                    user_type: userType
                });

                // try {
                //     const mailDetails = {
                //         to: email,
                //         subject: 'Registration successful.',
                //         name: fullname,
                //         message: 'Your account is successfully registered.'
                //     };

                //     const mail = new Mail();
                //     await mail.sendMail(mailDetails);

                    return res.status(201).json({ newUser});
                // } catch (error) {
                //    return res.status(500).json({ error: 'Failed to send registration email.' });
                // }
            }
        } else {
            return res.status(400).json({ error: 'Password is not matched!' });
        }
    } else {
        return res.status(400).json({ error: 'Not enough information' });
    }
};