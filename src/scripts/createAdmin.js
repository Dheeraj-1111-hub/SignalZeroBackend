import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../modules/auth/user.model.js";

await mongoose.connect("mongodb+srv://ysaidheeraj1111_db_user:sLEbEl5yaBFIl9bT@cluster0.17sxltg.mongodb.net/");

const password = "Admin@123";
const hash = await bcrypt.hash(password, 12);

await User.create({
  email: "admin@signalzero.gov",
  password: hash,
  role: "ADMIN",
  status: "ACTIVE",
  active: true,
});

console.log("✅ Admin created successfully");
process.exit();
