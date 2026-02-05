import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../modules/auth/user.model.js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI not set");
}

if (!process.env.OPERATOR_PASSWORD) {
  throw new Error("OPERATOR_PASSWORD not set");
}

await mongoose.connect(process.env.MONGO_URI);

const password = process.env.OPERATOR_PASSWORD;
const hash = await bcrypt.hash(password, 12);

await User.create({
  email: process.env.OPERATOR_EMAIL || "operator@signalzero.in",
  password: hash,
  role: "OPERATOR",
  status: "ACTIVE",
  active: true,
});

console.log("✅ Operator created successfully");
process.exit(0);
