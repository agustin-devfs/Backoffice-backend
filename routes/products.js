import express from "express";
import product from "../models/Products.js";

const router = express.Router();

// Ruta para obtener los usuarios con paginación (y respuesta compatible con React Admin)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
    const skip = (page - 1) * pageSize; // Calcular cuántos documentos saltar

    const totalProducts = await product.countDocuments(); // Contar usuarios en la DB
    const Products = await product.find().skip(skip).limit(pageSize);

    // Transformar los usuarios para que tengan el campo "id" en lugar de "_id"
    const transformedProducts = Products.map((product) => ({
      id: product._id.toString(), // Transformamos _id a id
      title: product.title,
      description: product.description,
      code:product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails
    }));

    // React Admin espera { data: [...], total: X }
    res.setHeader(
      "Content-Range",
      `Products ${skip + 1}-${skip + transformedProducts.length}/${totalProducts}`
    );
    res.json({ data: transformedProducts, total: totalProducts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await product.findById(req.params.id); // Buscar usuario por su _id

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    // Transformar el usuario para que tenga el campo "id" en lugar de "_id"
    const transformedproduct = {
      id: product._id.toString(), // Transformamos _id a id
      title: product.title,
      description: product.description,
      code:product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails
    };

    res.json({ data: transformedproduct });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const newproduct = new product(req.body);
    await newproduct.save();

    // Devolvemos el nuevo usuario con id en lugar de _id
    res
      .status(201)
      .json({ data: { id: newproduct._id.toString(), ...newproduct.toObject() } }); // Convertimos _id a id
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedproduct = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ data: updatedproduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedproduct = await product.findByIdAndDelete(req.params.id);

    if (!deletedproduct) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({ data: deletedproduct }); // Respuesta con el usuario eliminado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
