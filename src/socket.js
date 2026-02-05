import { Server } from "socket.io";
import { registerResponderSocket } from "./socket/responder.socket.js";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    registerResponderSocket(io, socket);
  });

  return io;
}

export function getIO() {
  return io;
}
