// middleware/galleryUploads.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();


// Configurar Cloudinary (se puede repetir aquí o asegurarte de que se configure globalmente)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar almacenamiento en Cloudinary para la galería
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "galeria", // Carpeta en Cloudinary para imágenes de galería
    format: async () => "png", // Formato de imagen, puedes ajustarlo según necesites
    public_id: (req, file) => file.originalname.split(".")[0] // Nombre del archivo sin extensión
  }
});

// Middleware de Multer para la galería
const galleryUpload = multer({ storage: galleryStorage });

export default galleryUpload;
