import express from "express";
import User from "./user.js";
// for password encryption
import bcrypt from "bcrypt";
// For input sanitize
import { body, validationResult } from "express-validator";
const router = express.Router();

// Sign Up
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    try {
      // Check if the email or username already exists
      const existingEmail = await User.findOne({ email });
      const existingUsername = await User.findOne({ username });

      if (existingEmail) {
        return res.status(409).json({ error: "Email already exists" });
      }

      if (existingUsername) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, username, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);
// Sign In
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Please Sign Up" });
      }

      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        return res.status(400).json({ message: "Incorrect Password" });
      }

      // If login is successful
      const { password: pwd, ...others } = user._doc;
      res.status(200).json({ message: "Login successful", user: others });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
