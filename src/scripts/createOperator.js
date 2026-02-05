import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../modules/auth/user.model.js";

await mongoose.connect("mongodb+srv://ysaidheeraj1111_db_user:sLEbEl5yaBFIl9bT@cluster0.17sxltg.mongodb.net/");

const password = "Operator@123";
const hash = await bcrypt.hash(password, 12);

await User.create({
  email: "operator@signalzero.in",
  password: hash,
  role: "OPERATOR",
  status: "ACTIVE",
  active: true,
});

console.log("✅ Operator created successfully");
process.exit();
