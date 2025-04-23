import mongoose from 'mongoose'

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/movingwallet'

  if (!uri) {
    throw new Error('No se encontró la URI de MongoDB en las variables de entorno')
  }

  try {
    await mongoose.connect(uri)
    console.log('✅ Conexión a MongoDB exitosa')
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err)
    throw err
  }
}
