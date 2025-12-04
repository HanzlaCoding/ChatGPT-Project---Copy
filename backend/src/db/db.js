import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/")
    .then(() => {
      console.log("Connected to Db Successfully!");
    })
    .catch((err) => {
      console.log(`Some error occur: ${err.message}`);
    });
};

export default connectDB;
