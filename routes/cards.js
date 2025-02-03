import express from "express";
import Card from "../models/Cards.js";

const router = express.Router();

// Ruta para obtener los usuarios con paginación (y respuesta compatible con React Admin)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
    const skip = (page - 1) * pageSize; // Calcular cuántos documentos saltar

    const totalCards = await Card.countDocuments(); // Contar usuarios en la DB
    const cards = await Card.find().skip(skip).limit(pageSize);

    // Transformar los usuarios para que tengan el campo "id" en lugar de "_id"
    const transformedCards = cards.map((card) => ({
      id: card._id.toString(), // Transformamos _id a id
      title: card.title,
      description: card.description,
      imageSrc: card.imageSrc,
      imageAlt: card.imageAlt,

    }));

    // React Admin espera { data: [...], total: X }
    res.setHeader(
      "Content-Range",
      `cards ${skip + 1}-${skip + transformedCards.length}/${totalCards}`
    );
    res.json({ data: transformedCards, total: totalCards });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cards" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id); // Buscar usuario por su _id

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Transformar el usuario para que tenga el campo "id" en lugar de "_id"
    const transformedCard = {
      id: card._id.toString(), // Transformamos _id a id
      title: card.title,
      description: card.description,
      imageSrc: card.imageSrc,
      imageAlt: card.imageAlt,
    };

    res.json({ data: transformedCard });
  } catch (error) {
    res.status(500).json({ message: "Error fetching card" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();

    // Devolvemos el nuevo usuario con id en lugar de _id
    res
      .status(201)
      .json({ data: { id: newCard._id.toString(), ...newCard.toObject() } }); // Convertimos _id a id
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ data: updatedCard });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);

    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({ data: deletedCard }); // Respuesta con el usuario eliminado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
