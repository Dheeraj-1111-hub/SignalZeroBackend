// src/modules/auth/user.model.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    /* ================= BASIC IDENTITY ================= */
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      trim: true,
    },

    /* ================= ROLE & STATUS ================= */
    role: {
      type: String,
      enum: ["CITIZEN", "OPERATOR", "ADMIN"],
      default: "CITIZEN",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },

    active: {
      type: Boolean,
      default: true,
    },

    /* ================= LOCATION / JURISDICTION ================= */
    city: {
      type: String,
      default: "Unknown",
      index: true,
    },

    /* ================= AUTH ================= */
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
