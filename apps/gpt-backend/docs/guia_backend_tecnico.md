# 🧠 Guía Técnica del Backend GPT – MovingWallet

### Estructura principal

- `actions/`: funciones puras agrupadas por tema (GitHub, Vercel, Pinecone, etc.)
- `routes/`: expone las acciones como endpoints
- `cron/`: scripts que se ejecutan periódicamente
- `data/`: estado actual y archivos sincronizados
- `config/`: claves, entorno, validación
- `docs/`: documentación interna del sistema
- `logs/`: registros auditables
- `tests/`: pruebas unitarias (recomendado usar Vitest)

---

### Flujo del GPT

1. El GPT hace una consulta (por ejemplo: \"¿Cuál es el último commit?\")
2. Se invoca una acción (ej. `getUltimoCommit`)
3. Se usa Pinecone o `.md` para responder con contexto real
4. El GPT puede generar nuevos archivos o recomendaciones

---

### Estado y snapshots

- `cron/generarSnapshot.ts` ejecuta cada noche:
  - Resume commit actual
  - Cuántos `.md` están indexados
  - Genera `estado_actual.md` + `status.json`

---

### Integración con IA

- El GPT usa `buscarEnPinecone` para dar respuestas técnicas
- Los archivos `.md` son el conocimiento vivo del sistema
- `routerInteligente` permite inferir qué acción llamar sin hardcodeo

---

**Última actualización:** abril 2025
