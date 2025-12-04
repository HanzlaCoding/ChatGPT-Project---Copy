import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/db/db.js";
import { initializeSocketIO } from "./src/sockets/socket.server.js";
import httpServer from "http";

const server = httpServer.createServer(app);
initializeSocketIO(server);

// config env
dotenv.config();
// connecting database
connectDb();

app.listen(3000, () => {
  console.log("Server is running on port: http://localhost:3000");
});

server.listen(4000, () => {
  console.log("Socket.IO server is running on http://localhost:4000");
});
