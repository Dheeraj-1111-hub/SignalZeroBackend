// src/server.js
import "./config/env.js";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

// 🔥 Workers should be imported but NOT awaited
import "./workers/ai.worker.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // ✅ Connect DB first
    await connectDB();

    const server = http.createServer(app);

    // ✅ Init Socket.IO
    initSocket(server);

    // ✅ MUST bind to 0.0.0.0 for Render
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 SignalZero API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1); // OK only on fatal startup failure
  }
}

startServer();
