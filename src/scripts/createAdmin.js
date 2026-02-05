import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../modules/auth/user.model.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const password = process.env.ADMIN_PASSWORD;

if (!password) {
  throw new Error("ADMIN_PASSWORD not set");
}

const hash = await bcrypt.hash(password, 12);

await User.create({
  email: process.env.ADMIN_EMAIL || "admin@signalzero.gov",
  password: hash,
  role: "ADMIN",
  status: "ACTIVE",
  active: true,
});

console.log("✅ Admin created successfully");
process.exit(0);
