//models/Events.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  imageSrc: { type: String, required: false },
  imageAlt: { type: String, required: false },
});

export default mongoose.model("Events", UserSchema);
