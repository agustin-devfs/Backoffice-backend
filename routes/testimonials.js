import express from "express";
import Testimonial from "../models/Testimonials.js";

const router = express.Router();

// Ruta para obtener los usuarios con paginación (y respuesta compatible con React Admin)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
    const skip = (page - 1) * pageSize; // Calcular cuántos documentos saltar

    const totalTestimonials = await Testimonial.countDocuments(); // Contar usuarios en la DB
    const testimonials = await Testimonial.find().skip(skip).limit(pageSize);

    // Transformar los usuarios para que tengan el campo "id" en lugar de "_id"
    const transformedTestimonials = testimonials.map((testimonial) => ({
      id: testimonial._id.toString(), // Transformamos _id a id
      author: testimonial.author,
      position: testimonial.position,
      quote: testimonial.quote,

    }));

    // React Admin espera { data: [...], total: X }
    res.setHeader(
      "Content-Range",
      `testimonials ${skip + 1}-${skip + transformedTestimonials.length}/${totalTestimonials}`
    );
    res.json({ data: transformedTestimonials, total: totalTestimonials });
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id); // Buscar usuario por su _id

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Transformar el usuario para que tenga el campo "id" en lugar de "_id"
    const transformedTestimonial = {
      id: testimonial._id.toString(), // Transformamos _id a id
      author: testimonial.author,
      position: testimonial.position,
      quote: testimonial.quote,
    };

    res.json({ data: transformedTestimonial });
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonial" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const newTestimonial = new Testimonial(req.body);
    await newTestimonial.save();

    // Devolvemos el nuevo usuario con id en lugar de _id
    res
      .status(201)
      .json({ data: { id: newTestimonial._id.toString(), ...newTestimonial.toObject() } }); // Convertimos _id a id
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ data: updatedTestimonial });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deletedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ data: deletedTestimonial }); // Respuesta con el usuario eliminado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
