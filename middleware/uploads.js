import multer from "multer";
import path from "path";
import fs from "fs";

// Asegurar que la carpeta "uploads/" exista
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Guarda las imágenes en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Nombre único
  },
});

// Configurar multer con límites y filtro de archivos
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Formato de archivo no permitido. Solo .jpg, .png y .webp")
      );
    }
    cb(null, true);
  },
});

export default upload;
