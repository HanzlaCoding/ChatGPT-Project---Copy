// socket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import userModel from "../models/user.model.js";
// Dummy implementations for external services
import generateResponse, { createEmbeddings } from "../services/ai.service.js"; // Assume these exist
import messageModel from "../models/messgae.model.js"; // Assume this exists
import { createMemory, createQuery } from "../services/vector.service.js"; // Assume these exist

const initializeSocketIO = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    // Note: Socket.IO handshake sometimes sends cookies in 'extraHeaders' or 'query'
    // but sticking to 'headers.cookie' for consistency.
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");

    if (!cookies?.token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      // Assume process.env.JWT_SECRET_KEY is defined
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);
      console.log(decoded);

      // FIX 6: Correctly use the User ID (decoded.id) from the JWT
      const user = await userModel.findById(decoded.userId);

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Clean up the user object before attaching (remove password)
      const safeUser = user.toObject();
      delete safeUser.password;

      socket.user = safeUser;
      next();
    } catch (err) {
      console.error("Socket Auth Error:", err.message);
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.user?.email} (${socket.id})`);

    socket.on("ai-message", async (messagePayload) => {
      try {
        // 1. Save User Message
        console.log(messagePayload);

        const userChat = await messageModel.create({
          chat: messagePayload.chatId,
          user: socket.user._id,
          content: messagePayload.message,
          role: "user",
        });

        // 2. Create Embeddings and Query Memory (independent)
        const [userVectors, memory] = await Promise.all([
          createEmbeddings(messagePayload.message),
          createQuery({
            queryVector: await createEmbeddings(messagePayload.message),
            limit: 3,
            metadata: { user: socket.user._id },
          }),
        ]);

        // 3. Save User Message to Memory
        await createMemory({
          vectors: userVectors,
          messageId: userChat._id,
          metadata: {
            user: socket.user._id,
            chat: messagePayload.chatId,
            text: messagePayload.message,
          },
        });

        // 4. Get Chat History
        const chatHistory = await messageModel
          .find({ chat: messagePayload.chatId })
          .sort({ createdAt: 1 })
          .lean();

        const stm = chatHistory.map((item) => ({
          role: item.role,
          parts: [{ text: item.content }],
        }));

        const ltmText = memory.map((item) => item.metadata.text).join("\n");

        const ltm = [
          {
            role: "user",
            parts: [{ text: ltmText }],
          },
        ];

        // 5. Generate AI Response
        const aiResponse = await generateResponse([...ltm, ...stm]);

        // 6. Create Embeddings and Save Message (independent)
        const [aiResponseVectors, chatResponse] = await Promise.all([
          createEmbeddings(aiResponse),
          messageModel.create({
            chat: messagePayload.chatId,
            user: socket.user._id,
            content: aiResponse,
            role: "model",
          }),
        ]);

        // 7. Save AI Response to Memory
        await createMemory({
          vectors: aiResponseVectors,
          messageId: chatResponse._id,
          metadata: {
            chat: messagePayload.chatId,
            user: socket.user._id,
            text: aiResponse,
          },
        });

        // 8. Emit Response
        socket.emit("ai-message", {
          reply: aiResponse,
          id: chatResponse._id,
          chatId: messagePayload.chatId,
        });
        console.log(aiResponse);
        "AI response sent to client.", aiResponse;
      } catch (error) {
        console.error("Error handling ai-message:", error);
        socket.emit("ai-error", { message: "Something went wrong." });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export { initializeSocketIO };
