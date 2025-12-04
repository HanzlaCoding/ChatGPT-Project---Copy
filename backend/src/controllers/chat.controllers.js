import chatModel from "../models/chat.model.js";
import messageModel from "../models/messgae.model.js";

const chatController = async (req, res) => {
  try {
    const { title } = req.body;

    const user = req.user;

    if (!user || !user._id) {
      return res
        .status(401)
        .json({ message: "User not authenticated or user ID is missing." });
    }

    if (!title) {
      return res.status(400).json({ message: "Chat title is required." });
    }

    const chat = await chatModel.create({
      user: user?._id,
      title,
    });

    res.status(201).json({
      message: "Chat created successfully!",
      chat: {
        _id: chat._id,
        title: chat.title,
        last_Activity: chat.lastActivity,
      },
    });
  } catch (error) {
    console.error("Chat creation error:", error);
    return res.status(500).json({
      message: "Server error during chat creation.",
      error: error.message,
    });
  }
};

const getChatTitles = async (req, res) => {
  const user = req.user;

  const title = await chatModel.find({
    user: user?._id,
  });

  if (!title) {
    res.status(400 && 401).json({
      message: "Error fetching chats. Try again later!",
    });
    return;
  }

  res.status(201).json({
    message: "Chats fetched successfully!",
    title: title.map((items, idx) => {
      return { id: items._id, title: items.title, user: items.user };
    }),
  });
};

const getChatsById = async (req, res) => {
  const { id } = req.params;

  const messages = await messageModel.find({
    user: id,
  });

  if (!messages) {
    res.status(400 && 401).json({
      message: "Error fetching messages. Try again later!",
    });
    return;
  }

  res.status(201).json({
    message: "Chats fetched successfully!",
    messages: messages.map((items) => {
      return {
        id: items._id,
        user: items.user,
        chatId: items.chat,
        content: items.content,
        role: items.role,
        //  "_id": "69237483b296db32a60bd5b8",
        //     "user": "691a29c9b37a3fcbcc9e5c1c",
        //     "chat": "692221dfa6b7e7f9aa503f24",
        //     "content": "hello gennie",
        //     "role": "user",
      };
    }),
  });
};
export { chatController, getChatTitles, getChatsById };
