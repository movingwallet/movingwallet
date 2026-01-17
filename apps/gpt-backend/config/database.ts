import mongoose from "mongoose";
import { loadEnv } from "./schema.env";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;

  const env = loadEnv();
  const uri = env.MONGO_URI;

  if (!uri) {
    // No reventamos: backend puede funcionar sin Mongo en muchos endpoints
    console.warn("⚠️ MONGO_URI no definido. Mongo desactivado.");
    return;
  }

  // Evitar múltiples conexiones en serverless
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  await mongoose.connect(uri);
  isConnected = true;

  console.log("✅ MongoDB conectado");
}
