import fs from 'fs/promises'
import path from 'path'

export async function crearEntradaDiario(nombre: string, contenido: string) {
  const filename = `${nombre.replace(/\s+/g, '_').toLowerCase()}.md`
  const filePath = path.join('data/actualizados', filename)

  const contenidoFinal = `# ${nombre}\n\n${contenido}\n\n---\n📅 ${new Date().toISOString()}`
  await fs.writeFile(filePath, contenidoFinal, 'utf-8')

  return { mensaje: 'Entrada guardada', archivo: filePath }
}
