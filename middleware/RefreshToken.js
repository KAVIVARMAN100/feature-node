import jwt from "jsonwebtoken";
// import Login from "../modules/vendor/models/VendorModel.js";
import Login from "../models/vendorModel.js";

export const refreshToken = async (req, res) => {
  console.log("refresh token backend");
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

      const user = await Login.findOne({
        where: {
          id: decoded.id,
        },
      });
      let id = user.dataValues.id;
      let name = user.dataValues.username;
      console.log("refreshToken");
      if (user) {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
          if (err) return res.sendStatus(403);
         
          const accessToken = jwt.sign(
            { id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "2m",
            }
          );
          const refreshToken = jwt.sign(
            { id },
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: "4m",
            }
          )
            res.status(200).json({ accessToken, refreshToken, name });
             console.log(accessToken,refreshToken,name);
        })
      } else {
        return res.sendStatus(403);
      }
    } catch (error) {
      return res.status(401).json({error: true, message:"refreshToken expired"})
    }
  } else {
    return res.status(401).json({error: true, message: "No token provided.",});
  }
};
 