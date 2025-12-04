import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import chatRoute from "./routes/chat.routes.js";
import path from "path";

const app = express();

// Middelwares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://chatgpt-project-copy.onrender.com/",
    credentials: true,
  })
);
app.use(express.static(__dirname, "../public"));

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoute);

export default app;
