import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },

    actor: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: String,
      email: String,
    },

    entity: {
      type: {
        type: String, // Incident, Responder, Settings, User
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },

    metadata: {
      type: Object, // flexible JSON (before/after, notes, etc.)
    },

    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", AuditLogSchema);
