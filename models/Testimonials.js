//models/Testimonials.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  author: { type: String, required: true, unique: true, default: "Testimonials" },
  quote: { type: String, required: true, unique: true },
  position: { type: String, required: false },

});

export default mongoose.model("Testimonials", UserSchema);
