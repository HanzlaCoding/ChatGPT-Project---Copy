import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authUserMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Access Denied. Token not found.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Authentication failed. User not found.",
      });
    }

    req.user = user;

    next();

  } catch (err) {
    console.error("Authentication Error:", err.message);

    let message = "Invalid Token.";
    if (err.name === "TokenExpiredError") {
      message = "Session expired. Please log in again.";
    }

    return res.status(401).json({
      message: message,
      error: err.name,
    });
  }
};

export default authUserMiddleware;
