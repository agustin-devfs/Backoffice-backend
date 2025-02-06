import express from "express";
import Event from "../models/Events.js";

const router = express.Router();

// Ruta para obtener los usuarios con paginación (y respuesta compatible con React Admin)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
    const skip = (page - 1) * pageSize; // Calcular cuántos documentos saltar

    const totalEvents = await Event.countDocuments(); // Contar usuarios en la DB
    const events = await Event.find().skip(skip).limit(pageSize);

    // Transformar los usuarios para que tengan el campo "id" en lugar de "_id"
    const transformedEvents = events.map((event) => ({
      id: event._id.toString(), // Transformamos _id a id
      title: event.title,
      description: event.description,
      date: event.date,
      imageSrc: event.imageSrc,
      imageAlt: event.imageAlt,

    }));

    // React Admin espera { data: [...], total: X }
    res.setHeader(
      "Content-Range",
      `events ${skip + 1}-${skip + transformedEvents.length}/${totalEvents}`
    );
    res.json({ data: transformedEvents, total: totalEvents });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id); // Buscar usuario por su _id

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Transformar el usuario para que tenga el campo "id" en lugar de "_id"
    const transformedEvent = {
      id: event._id.toString(), // Transformamos _id a id
      title: event.title,
      description: event.description,
      date: event.date,
      imageSrc: event.imageSrc,
      imageAlt: event.imageAlt,
    };

    res.json({ data: transformedEvent });
  } catch (error) {
    res.status(500).json({ message: "Error fetching event" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();

    // Devolvemos el nuevo usuario con id en lugar de _id
    res
      .status(201)
      .json({ data: { id: newEvent._id.toString(), ...newEvent.toObject() } }); // Convertimos _id a id
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ data: updatedEvent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ data: deletedEvent }); // Respuesta con el usuario eliminado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
