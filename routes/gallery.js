// routes/gallery.js
import express from "express";
import Gallery from "../models/Gallery.js";
import galleryUpload from "../middleware/galleryUploads.js"; // Middleware para subir a Cloudinary en la carpeta "galeria"

const router = express.Router();

// Obtener galerías con paginación
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const totalGalleries = await Gallery.countDocuments();
    const galleries = await Gallery.find().skip(skip).limit(pageSize);

    const transformedGalleries = galleries.map((gallery) => ({
      id: gallery._id.toString(),
      alt: gallery.alt,
      imageSrc: gallery.imageSrc,
    }));

    res.setHeader(
      "Content-Range",
      `galleries ${skip + 1}-${skip + transformedGalleries.length}/${totalGalleries}`
    );
    res.json({ data: transformedGalleries, total: totalGalleries });
  } catch (error) {
    res.status(500).json({ message: "Error fetching galleries" });
  }
});

// Obtener una galería por ID
router.get("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.json({ data: gallery });
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery" });
  }
});

// Crear una nueva galería
router.post("/", galleryUpload.single("imagen"), async (req, res) => {
  try {
    const { alt } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }
    
    // req.file.path contiene la URL generada por Cloudinary
    const newGallery = new Gallery({
      alt,
      imageSrc: req.file.path,
    });

    await newGallery.save();
    res.status(201).json({ data: newGallery });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una galería (incluyendo imagen)
router.put("/:id", galleryUpload.single("imagen"), async (req, res) => {
  try {
    const updatedData = {};
    if (req.body.alt) updatedData.alt = req.body.alt;
    if (req.file) {
      updatedData.imageSrc = req.file.path;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json({ data: updatedGallery });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una galería
router.delete("/:id", async (req, res) => {
  try {
    const deletedGallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!deletedGallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.status(200).json({ data: deletedGallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
