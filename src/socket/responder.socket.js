import mongoose from "mongoose";
import Responder from "../modules/responders/responder.model.js";

export function registerResponderSocket(io, socket) {
  const { responderId } = socket.handshake.auth;

  if (!mongoose.Types.ObjectId.isValid(responderId)) {
    console.warn("⚠️ Invalid responderId:", responderId);
    socket.disconnect();
    return;
  }

  console.log("🚓 Responder socket active:", socket.id);

  socket.on("responder:gps", async ({ lat, lng }) => {
    const responder = await Responder.findByIdAndUpdate(
      responderId,
      {
        location: {
          lat,
          lng,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!responder) return;

    // 🔥 Broadcast to dashboards
    io.emit("responder:gps:update", {
      responderId,
      lat,
      lng,
      incidentId: responder.currentIncident ?? null,
      role: responder.role,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Responder disconnected:", socket.id);
  });
}
