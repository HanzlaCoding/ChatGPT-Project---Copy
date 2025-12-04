import { Router } from "express";

import {
  chatController,
  getChatsById,
  getChatTitles,
} from "../controllers/chat.controllers.js";

import authUserMiddleware from "../middlewares/auth.middleware.js";

// Router Instance
const router = Router();

// Respective Routes
router.post("/", authUserMiddleware, chatController);

router.get("/chat-titles", authUserMiddleware, getChatTitles);

router.get("/messages/:id", authUserMiddleware, getChatsById);

export default router;
