//models/Gallery.js
import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
  imageSrc: { type: String, required: false },
  alt: { type: String, required: false },
});

export default mongoose.model("Gallery", GallerySchema);
