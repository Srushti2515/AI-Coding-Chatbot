import Chat from "../models/Chat.js";
import { generateAIChatResponse } from "../services/aiService.js";

// @desc    Get all chats for logged-in user
// @route   GET /api/chats
export const getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select("title createdAt updatedAt messages")
      .sort({ updatedAt: -1 });

    const formattedChats = chats.map(chat => ({
      _id: chat._id,
      title: chat.title,
      messageCount: chat.messages.length,
      lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : "",
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    res.json(formattedChats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chat details with full messages
// @route   GET /api/chats/:id
export const getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat conversation not found" });
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
};

// @desc    Send message (Creates/updates chat, calls Gemini AI)
// @route   POST /api/chat
export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, message, attachment } = req.body;

    if (!message && !attachment) {
      return res.status(400).json({ success: false, message: "Message content or file attachment is required" });
    }

    let fullPrompt = (message || "").trim();
    if (attachment && attachment.content) {
      fullPrompt += `\n\n[Attached File: ${attachment.name}]\n\`\`\`${attachment.language || ""}\n${attachment.content}\n\`\`\``;
    }

    let chat = null;
    let historyMessages = [];

    if (req.user) {
      if (chatId && chatId !== "temp_chat" && chatId !== "guest_chat_1") {
        chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
      }

      if (!chat) {
        const generatedTitle = (fullPrompt || "Code Query").slice(0, 32) + (fullPrompt.length > 32 ? "..." : "");
        chat = new Chat({
          userId: req.user._id,
          title: generatedTitle,
          messages: [],
        });
      }

      const userMsg = {
        role: "user",
        content: fullPrompt,
        createdAt: new Date(),
      };
      chat.messages.push(userMsg);
      historyMessages = chat.messages;
    } else {
      historyMessages = [{ role: "user", content: fullPrompt }];
    }

    // Call Gemini AI Service
    console.log(`[ChatController] Requesting Gemini AI for prompt: "${fullPrompt.slice(0, 50)}..."`);
    const aiResponseText = await generateAIChatResponse(historyMessages);

    const aiMsg = {
      role: "assistant",
      content: aiResponseText,
      createdAt: new Date(),
    };

    if (chat) {
      chat.messages.push(aiMsg);
      await chat.save();
    }

    return res.status(200).json({
      success: true,
      message: aiResponseText,
      aiMessage: aiMsg,
      chatId: chat ? chat._id : (chatId || "guest_chat"),
      title: chat ? chat.title : "Conversation",
      messages: chat ? chat.messages : [
        { role: "user", content: fullPrompt, createdAt: new Date() },
        aiMsg
      ],
    });
  } catch (error) {
    console.error("[ChatController Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
      error: error.message,
    });
  }
};

// @desc    Update chat title
// @route   PUT /api/chats/:id
export const updateChatTitle = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chat
// @route   DELETE /api/chats/:id
export const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat conversation not found" });
    }
    res.json({ success: true, message: "Chat successfully deleted" });
  } catch (error) {
    next(error);
  }
};

