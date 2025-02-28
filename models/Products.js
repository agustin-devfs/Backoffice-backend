// models/Products.js
import mongoose from "mongoose";

const ThumbnailSchema = new mongoose.Schema({
  rawFile: {
    path: { type: String },
    relativePath: { type: String },
  },
  src: { type: String },
  title: { type: String },
}, { _id: false }); // _id: false evita generar un id para cada subdocumento

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["available", "unavailable"], default: "available" },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  thumbnails: [ThumbnailSchema],
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
