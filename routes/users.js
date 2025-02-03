import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Ruta para obtener los usuarios con paginación (y respuesta compatible con React Admin)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
    const skip = (page - 1) * pageSize; // Calcular cuántos documentos saltar

    const totalUsers = await User.countDocuments(); // Contar usuarios en la DB
    const users = await User.find().skip(skip).limit(pageSize);

    // Transformar los usuarios para que tengan el campo "id" en lugar de "_id"
    const transformedUsers = users.map((user) => ({
      id: user._id.toString(), // Transformamos _id a id
      name: user.name,
      email: user.email,
      role: user.role,
    }));

    // React Admin espera { data: [...], total: X }
    res.setHeader(
      "Content-Range",
      `users ${skip + 1}-${skip + transformedUsers.length}/${totalUsers}`
    );
    res.json({ data: transformedUsers, total: totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Buscar usuario por su _id

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transformar el usuario para que tenga el campo "id" en lugar de "_id"
    const transformedUser = {
      id: user._id.toString(), // Transformamos _id a id
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({ data: transformedUser });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    // Devolvemos el nuevo usuario con id en lugar de _id
    res
      .status(201)
      .json({ data: { id: newUser._id.toString(), ...newUser.toObject() } }); // Convertimos _id a id
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: deletedUser }); // Respuesta con el usuario eliminado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
