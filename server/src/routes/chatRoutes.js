import express from "express";
import {
  getUserChats,
  getChatById,
  sendMessage,
  updateChatTitle,
  deleteChat,
} from "../controllers/chatController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow optional auth for sending messages so guest & authenticated users both get real Gemini responses
router.post("/chat", optionalProtect, sendMessage);

// Require strict auth for managing saved history
router.get("/chats", protect, getUserChats);
router.get("/chats/:id", protect, getChatById);
router.put("/chats/:id", protect, updateChatTitle);
router.delete("/chats/:id", protect, deleteChat);

export default router;

