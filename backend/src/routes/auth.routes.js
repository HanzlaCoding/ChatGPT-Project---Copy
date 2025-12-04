import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controllers.js";

const router = Router();

// Register Route
router.post("/register", registerController);
// Login Route
router.post("/login", loginController);
// Logout Route
router.post("/logout", logoutController);

export default router;
