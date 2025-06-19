//includes libaries like bcryptjs, json web token for user to not login againa and again

import express from "express"; // Import the Express framework for building web applications.
import { User } from "../models/User.js"; // Import the User model, which is defined in another file.
import { body, validationResult } from "express-validator"; // Import functions for request validation.
const router = express.Router(); // Create a router object for defining routes.

import bcrypt from "bcryptjs"; // Import bcryptjs for hashing passwords.
import jwt from "jsonwebtoken"; //jwt.io and jsonwebtoken   Import jsonwebtoken for creating and verifying JWTs.
// Secret key for signing JWTs.

import fetchUser from "../middleware/fetchUser.js";
import dotenv from "dotenv"; // Import dotenv for environment variable management.
dotenv.config(); // Load environment variables from a .env file into process.env.
//ROUTE1 create a user using POST /auth no login required//express validation vanne nai xa
//router.post(path, [middleware], callback);

router.post(
  "/createuser",
  [
    body("name").isLength({ min: 2 }).withMessage("Not a valid name"),
    body("email").isEmail().withMessage("Not a valid e-mail address"),
    body("password")
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Enter atleast 5 characters"),
  ],

  async (req, res) => {
    let success = false;
    const errorobj = validationResult(req); // returns an object that contains validation errors (if obj empty no error)
    if (!errorobj.isEmpty()) {
      //isEmpty returns true if there are no errors(valid) and false if there are errors. ! xa so false ma if chlx
      return res.send({ success, errors: errorobj.array() }); //valid xaina vane error cause hunu
    }

    try {
      //check if user already exists using email
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists",
        });
      }

      const salt = await bcrypt.genSaltSync(10);
      const secpasword = await bcrypt.hash(req.body.password, salt); // Hash the password with the salt.

      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpasword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // res.json(user);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
          sameSite: "Lax", // CSRF protection
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({
          success: true,
          message: "Logged in successfully",
          user: {
            id: user.id,
            name: user.name,
          },
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

//ROUTE2 authenciatee a user using POST "/api/auth/login". No login req.

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Not a valid e-mail address"),
    body("password")
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Password must be  atleast 5 characters"),
  ],

  async (req, res) => {
    const errorobj = validationResult(req); // returns an object that contains validation errors (if obj empty no error)
    if (!errorobj.isEmpty()) {
      //isEmpty returns true if there are no errors(valid) and false if there are errors.
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Please try to login with correct email",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success: false,
          error: "Please try to login with correct password",
        });
      }
      if (!user || !passwordCompare) {
        return res.status(400).json({
          success: false,
          error: "Invalid credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "7d",
      }); // console.log(token);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true, // true in production (HTTPS)
          sameSite: "none", // CSRF protection
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          domain: ".onrender.com",
        })
        .json({
          success: true,
          message: "Logged in successfully",
          user: {
            id: user.id,
            name: user.name,
          },
          token: token,
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Service unavailable. Please try again later.",
      });
    }
  }
);

//ROUTE3: Get login user details using POST   "api/auth/getuser".Login required/

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    })
    .json({ success: true, message: "Logged out successfully" });
});
router.get("/me", fetchUser, async (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: req.user,
      token: req.cookies.token,
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
