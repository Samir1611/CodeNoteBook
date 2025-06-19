import jwt from "jsonwebtoken";
import dotenv from "dotenv"; // Import dotenv for environment variable management.
import { User } from "../models/User.js";
dotenv.config();
const fetchUser = async (req, res, next) => {
  //get the user from the jwt token and add id  to req obj
  const token = req.cookies?.token;
  if (!token) {
    req.user = null;
    return next();
    // return res.status(200).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("id name");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
  // next();
};
export default fetchUser;
