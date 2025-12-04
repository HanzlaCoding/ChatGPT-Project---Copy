import mongoose, { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      required: true,
      type: String,
    },
    lastActivity: {
      default: Date.now(),
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = model("chatgpt-chats", chatSchema);


export default chatModel;
