//models/Cards.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true, unique: true },
  imageSrc: { type: String, required: false },
  imageAlt: { type: String, required: false },
});

export default mongoose.model("Cards", UserSchema);
