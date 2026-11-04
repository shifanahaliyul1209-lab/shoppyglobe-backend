import mongoose from "mongoose";

// Schema: a registered user (the password is stored hashed, never as plain text)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);