//server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import usersRoute from "./routes/users.js";
import navsRoute from "./routes/navs.js";
import heroRoute from "./routes/hero.js";
import cardsRoute from "./routes/cards.js";
import eventsRoute from "./routes/events.js";
import testimonialsRoute from "./routes/testimonials.js";
import productsRoute from "./routes/products.js";

// Configurar variables de entorno
dotenv.config();
const app = express();

// Conexión a MongoDB
connectDB();

// Configurar CORS
app.use(
  cors({
    exposedHeaders: ["Content-Range"],
  })
);

// Middlewares
app.use(cors());
app.use(express.json());
// Servir imágenes desde 'uploads'
app.use("/uploads", express.static("uploads"));

// Rutas
app.use("/api/users", usersRoute);
app.use("/api/nav", navsRoute);
app.use("/api/hero", heroRoute);
app.use("/api/cards", cardsRoute);
app.use("/api/testimonials", testimonialsRoute);
app.use("/api/events", eventsRoute);
app.use("/api/products", productsRoute);


// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
