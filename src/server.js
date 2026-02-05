// src/server.js
import "./config/env.js";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";
import "./workers/ai.worker.js";


const PORT = process.env.PORT || 5000;

await connectDB();

const server = http.createServer(app);

// 🔥 INIT SOCKET.IO
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚨 SignalZero API running on port ${PORT}`);
});
