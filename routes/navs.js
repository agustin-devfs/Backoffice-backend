import express from "express";
import Nav from "../models/Nav.js";

const router = express.Router();

// Ruta para obtener los usuarios con paginación (y respuesta compatible con React Admin)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
    const skip = (page - 1) * pageSize; // Calcular cuántos documentos saltar

    const totalNav = await Nav.countDocuments(); // Contar usuarios en la DB
    const nav = await Nav.find().skip(skip).limit(pageSize);

    // Transformar los usuarios para que tengan el campo "id" en lugar de "_id"
    const transformedNav = nav.map((nav) => ({
      id: nav._id.toString(), // Transformamos _id a id
      nav: nav.nav,
      linkNav: nav.linkNav,
    }));

    // React Admin espera { data: [...], total: X }
    res.setHeader(
      "Content-Range",
      `nav ${skip + 1}-${skip + transformedNav.length}/${totalNav}`
    );
    res.json({ data: transformedNav, total: totalNav });
  } catch (error) {
    res.status(500).json({ message: "Error fetching nav" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const nav = await Nav.findById(req.params.id); // Buscar usuario por su _id

    if (!nav) {
      return res.status(404).json({ message: "Nav not found" });
    }

    // Transformar el usuario para que tenga el campo "id" en lugar de "_id"
    const transformedNav = {
      id: nav._id.toString(), // Transformamos _id a id
      nav: nav.nav,
      linkNav: nav.linkNav,
    };

    res.json({ data: transformedNav });
  } catch (error) {
    res.status(500).json({ message: "Error fetching nav" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const newNav = new Nav(req.body);
    await newNav.save();

    // Devolvemos el nuevo usuario con id en lugar de _id
    res
      .status(201)
      .json({ data: { id: newNav._id.toString(), ...newNav.toObject() } }); // Convertimos _id a id
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedNav = await Nav.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ data: updatedNav });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedNav = await Nav.findByIdAndDelete(req.params.id);

    if (!deletedNav) {
      return res.status(404).json({ message: "Nav not found" });
    }

    res.status(200).json({ data: deletedNav }); // Respuesta con el usuario eliminado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
