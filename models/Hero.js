//models/Hero.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  titleHero: { type: String, required: true, unique: true, default: "Hero" },
  textHero: { type: String, required: true, unique: true },
  buttonL: { type: String, required: true },
  buttonR: { type: String, required: true },


});

export default mongoose.model("Hero", UserSchema);
