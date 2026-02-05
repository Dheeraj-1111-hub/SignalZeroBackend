import mongoose from "mongoose";

const ResponderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    role: {
      type: String,
      enum: ["POLICE", "AMBULANCE", "FIRE"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ================= PHASE 15 ================= */

    isOnDuty: {
      type: Boolean,
      default: false,
      index: true,
    },

    shift: {
      start: Date,
      end: Date,
    },

    availability: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "OFFLINE"],
      default: "OFFLINE",
      index: true,
    },

    /* ============================================ */

    currentIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      default: null,
    },

    location: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Responder", ResponderSchema);
