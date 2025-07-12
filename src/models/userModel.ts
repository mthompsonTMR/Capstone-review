import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"], // ✅ fixed typo
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"], // ✅ fixed typo
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"], // ✅ fixed typo
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
}, { timestamps: true });

// ✅ Correct model export
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
