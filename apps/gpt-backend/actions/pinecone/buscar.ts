export async function buscarEnPinecone(pregunta: string): Promise<any> {
  return {
    resultado: `Simulación de búsqueda Pinecone para: "${pregunta}"`,
    fuente: 'mock-pinecone',
    timestamp: new Date().toISOString()
  }
}
