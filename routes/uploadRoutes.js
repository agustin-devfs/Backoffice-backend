import express from "express";
import upload from "../config/multerConfig.js";

const router = express.Router();

// Endpoint para subir imágenes a Cloudinary
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ imageUrl: req.file.path });
});

export default router;
