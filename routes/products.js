import express from "express";
import Product from "../models/Products.js";
import upload from "../middleware/uploads.js";
const router = express.Router();

// Obtener productos con paginación
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find().skip(skip).limit(pageSize);

    const transformedProducts = products.map((product) => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails,
    }));

    res.setHeader(
      "Content-Range",
      `products ${skip + 1}-${
        skip + transformedProducts.length
      }/${totalProducts}`
    );
    res.json({ data: transformedProducts, total: totalProducts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Crear un nuevo producto
router.post("/", upload.array("thumbnails", 5), async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category } = req.body;

    let thumbnailsData = [];
    if (req.files && req.files.length > 0) {
      // Si se subieron archivos mediante multer, armamos el objeto a partir de ellos
      thumbnailsData = req.files.map(file => ({
        rawFile: { path: `/uploads/${file.filename}`, relativePath: `/uploads/${file.filename}` },
        src: `/uploads/${file.filename}`,
        title: file.originalname,
      }));
    } else if (req.body.thumbnails) {
      // Si se envían thumbnails desde el cliente (por ejemplo, en formato JSON)
      thumbnailsData = req.body.thumbnails;
    }

    const newProduct = new Product({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails: thumbnailsData,
    });

    await newProduct.save();
    res.status(201).json({ data: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un producto (incluyendo imágenes)
router.put("/:id", upload.array("thumbnails", 5), async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category } = req.body;

    const updatedData = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    };

    // Procesar thumbnails según cómo lleguen
    if (req.files && req.files.length > 0) {
      updatedData.thumbnails = req.files.map(file => ({
        rawFile: { path: `/uploads/${file.filename}`, relativePath: `/uploads/${file.filename}` },
        src: `/uploads/${file.filename}`,
        title: file.originalname,
      }));
    } else if (req.body.thumbnails) {
      updatedData.thumbnails = req.body.thumbnails;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
