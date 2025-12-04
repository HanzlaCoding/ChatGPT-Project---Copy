import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullname: {
      firstname: {
        required: true,
        type: String,
      },

      lastname: {
        required: true,
        type: String,
      },
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model("chatgpt-user", userSchema);

export default userModel;
