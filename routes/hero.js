import express from "express";
import Hero from "../models/Hero.js";

const router = express.Router();

// Ruta para obtener los usuarios con paginación (y respuesta compatible con React Admin)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
    const skip = (page - 1) * pageSize; // Calcular cuántos documentos saltar

    const totalHero = await Hero.countDocuments(); // Contar usuarios en la DB
    const hero = await Hero.find().skip(skip).limit(pageSize);

    // Transformar los usuarios para que tengan el campo "id" en lugar de "_id"
    const transformedHero = hero.map((hero) => ({
      id: hero._id.toString(), // Transformamos _id a id
      title: hero.title,
      text: hero.text,
      buttonL: hero.buttonL,
      buttonR: hero.buttonR,
    }));

    // React Admin espera { data: [...], total: X }
    res.setHeader(
      "Content-Range",
      `hero ${skip + 1}-${skip + transformedHero.length}/${totalHero}`
    );
    res.json({ data: transformedHero, total: totalHero });
  } catch (error) {
    res.status(500).json({ message: "Error fetching hero" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id); // Buscar usuario por su _id

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    // Transformar el usuario para que tenga el campo "id" en lugar de "_id"
    const transformedHero = {
      id: hero._id.toString(), // Transformamos _id a id
      title: hero.title,
      text: hero.text,
      buttonL: hero.buttonL,
      buttonR: hero.buttonR,
    };

    res.json({ data: transformedHero });
  } catch (error) {
    res.status(500).json({ message: "Error fetching hero" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const newHero = new Hero(req.body);
    await newHero.save();

    // Devolvemos el nuevo usuario con id en lugar de _id
    res
      .status(201)
      .json({ data: { id: newHero._id.toString(), ...newHero.toObject() } }); // Convertimos _id a id
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedHero = await Hero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ data: updatedHero });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedHero = await Hero.findByIdAndDelete(req.params.id);

    if (!deletedHero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.status(200).json({ data: deletedHero }); // Respuesta con el usuario eliminado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
