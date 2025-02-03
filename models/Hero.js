//models/Hero.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, default: "Hero" },
  text: { type: String, required: true, unique: true },
  buttonL: { type: String, required: false },
  buttonR: { type: String, required: false },


});

export default mongoose.model("Hero", UserSchema);
