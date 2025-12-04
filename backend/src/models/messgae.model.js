import mongoose, { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = model("chatgpt-messages", messageSchema);

export default messageModel;
