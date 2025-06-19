import jwt from "jsonwebtoken";
import dotenv from "dotenv"; // Import dotenv for environment variable management.
dotenv.config();
const fetchUser = (req, res, next) => {
  //get the user from the jwt token and add id  to req obj
  const token = req.cookies?.token;
  if (!token) {
    req.user = null;
    return next();
    // return res.status(200).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
  next();
};
export default fetchUser;
