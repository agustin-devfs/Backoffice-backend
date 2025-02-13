import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["available", "unavailable"], default: "available" },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  thumbnails: [{ type: String }], 
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);

