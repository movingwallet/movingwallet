import mongoose from "mongoose";

export const connectToDatabase = async () => {
  const dbUri = process.env.MONGODB_URI;
  
  if (!dbUri) {
    throw new Error("MONGODB_URI no está definido en las variables de entorno");
  }

  try {
    await mongoose.connect(dbUri);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error de conexión a MongoDB:", error);
    throw error;
  }
};