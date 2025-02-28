import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde el .env

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ No se encontró la variable MONGO_URI en el .env");
  process.exit(1);
}

const testConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conexión exitosa a MongoDB Atlas");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }
};

testConnection();
