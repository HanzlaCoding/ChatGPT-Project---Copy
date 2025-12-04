import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import e from "express";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { email, password, firstname, lastname, username } = req.body;
    // const firstname = fullname?.firstname;
    // const lastname = fullname?.lastname;
    console.log(email, password, firstname, lastname, username);

    if (!email || !password || !firstname || !lastname || !username) {
      return res.status(400).json({
        message:
          "All fields (email, password, firstname, lastname) are required.",
      });
    }

    const existingUser = await userModel.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return res.status(409).json({
        message:
          "ُPlease login your account /api/auth/login. This email already exist!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      username,
      password: hashedPassword,
      fullname: { firstname, lastname },
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: newUser._id,
        email: newUser.email,
        fullname: newUser.fullname,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Keep the error handler for database unique index violations (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User with this email already exists.",
      });
    }

    // Add a generic 500 status response for other unexpected errors
    return res.status(500).json({
      message: "An unexpected error occurred during registration.",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body, email, password);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        message: "Please create your accoount => /api/auth/register.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userToReturn = {
      _id: existingUser._id,
      email: existingUser.email,
      fullname: existingUser.fullname,
    };

    return res.status(200).json({
      message: "Login successful! Token set in cookie.",
      user: userToReturn,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login.",
      error: error.message,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Server error during logout.",
      error: error.message,
    });
  }
};

export { registerController, loginController, logoutController };
