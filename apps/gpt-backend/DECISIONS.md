# DECISIONS.md  
## MovingWallet & AI Infrastructure – Architectural Decision Records

Este documento recoge las **decisiones técnicas y de producto ya tomadas**, junto con su motivación.
Su objetivo es evitar reabrir debates cerrados, mantener coherencia a largo plazo y servir como
fuente de verdad para humanos e IA.

---

## ADR-001 — Uso de OpenAI Responses API (no Assistants)

**Estado**: Aprobado  
**Fecha**: 2026-01  
**Contexto**:  
OpenAI está deprecando Assistants API. Se necesita una API estable, moderna y flexible para
integraciones productivas y tool-calling.

**Decisión**:  
Usar **OpenAI Responses API** desde el primer día.

**Motivación**:
- API unificada y futura
- Mejor control de prompts y tools
- Compatible con backend propio
- Evita migraciones futuras

**Consecuencias**:
- Todo el código de IA se basa en `responses.create`
- Chat, RAG y herramientas usan el mismo motor

---

## ADR-002 — Vector DB: Qdrant desde el día 1 (no Pinecone)

**Estado**: Aprobado  
**Contexto**:  
El proyecto necesita indexar repositorios, documentos y memoria estructurada sin vendor lock-in.

**Decisión**:  
Usar **Qdrant Cloud** como vector database principal desde el inicio.

**Motivación**:
- Payloads ricos (path, commit, branch, tipo)
- Buen rendimiento para RAG de repos
- Free tier suficiente para MVP
- Evita migración futura

**Consecuencias**:
- Pinecone descartado
- Arquitectura basada en adapters para poder cambiar de proveedor

---

## ADR-003 — Dos chats separados: Admin vs Usuario

**Estado**: Aprobado  
**Contexto**:  
Mezclar soporte al usuario con acceso al repo y decisiones técnicas introduce riesgos de seguridad
y contaminación de contexto.

**Decisión**:
Separar claramente:
- **Chat Admin / Dev** (interno)
- **Chat Usuario Final** (público)

**Detalles**:
- Chat Admin:
  - Accede al repo indexado
  - Explica errores, builds, arquitectura
  - Protegido por auth/password
- Chat Usuario:
  - FAQs + documentación
  - No accede a código ni rutas internas

**Consecuencias**:
- Prompts separados
- Vector stores separados
- Políticas de seguridad distintas

---

## ADR-004 — La IA NO está en el camino crítico del dinero

**Estado**: Aprobado  
**Contexto**:  
MovingWallet opera con activos financieros reales. El riesgo de ejecución autónoma es inaceptable.

**Decisión**:
La IA **nunca**:
- Firma transacciones
- Accede a private keys
- Ejecuta transfers sin aprobación humana

La IA **sí puede**:
- Analizar
- Recomendar
- Priorizar
- Explicar riesgos

**Consecuencias**:
- Firma siempre en cliente (wallet)
- IA es “advisor”, no “executor”
- Seguridad prioritaria sobre automatización

---

## ADR-005 — “IA dentro del repo” es un error conceptual

**Estado**: Aprobado  
**Contexto**:  
El lenguaje impreciso genera malas decisiones técnicas.

**Decisión**:
La IA **no vive en GitHub**.

Modelo correcto:
GitHub Repo
↓ (push / PR)
GitHub Action
↓
Backend (Vercel)
↓
Qdrant
↓
OpenAI Responses API
↓
Chat Admin


**Consecuencias**:
- Todo acceso al repo es event-driven
- No hay “lectura mágica en tiempo real”
- Control total de seguridad

---

## ADR-006 — Orden de desarrollo

**Estado**: Aprobado  

**Decisión**:
El orden correcto es:

1. Integrar OpenAI en el repo (chat funcional)
2. MovingWallet V1 estable
3. IA avanzada
4. Auto-evolución

**Motivación**:
- La IA no arregla un producto roto
- La V1 debe ser resiliente sin IA
- La IA multiplica valor solo cuando hay base sólida

---

## ADR-007 — Arquitectura portable (adapter pattern)

**Estado**: Aprobado  
**Decisión**:
Toda dependencia externa crítica usa adapters.

Ejemplo:
```ts
interface VectorDB {
  search(...)
  upsert(...)
}

Motivación:

Evitar vendor lock-in

Facilitar migraciones

Permitir evolución sin refactor masivo

ADR-008 — Seguridad blockchain como principio base

Estado: Aprobado

Decisión:

Nunca enviar private keys a backend o IA

Solo usar datos públicos (addresses, tx, ABIs)

Firma siempre en cliente

Consecuencias:

Backend es analítico

Cliente es soberano

IA es observadora

ADR-009 — Auto-evolución solo con límites

Estado: Aprobado
Contexto:
La auto-mejora sin límites es peligrosa en sistemas financieros.

Decisión:
La IA puede:

Proponer cambios

Generar PRs

Sugerir mejoras

Pero:

Cambios pequeños → auto-deploy con métricas

Cambios medios → A/B testing

Cambios grandes → aprobación humana

Rollback automático si error rate > umbral.

ADR-010 — V1 primero, siempre

Estado: Aprobado

Decisión:
Nada entra en el scope si no contribuye directamente a:

estabilidad

seguridad

comprensión del usuario

Motivación:
Un MVP sólido vale más que 10 features inacabadas.

Fin del documento

Este archivo debe actualizarse solo cuando una decisión esté realmente tomada.
No se usa para ideas, solo para hechos.


---

## ✅ Qué hacer ahora (muy concreto)

1. Crear archivo `DECISIONS.md`
2. Pegar este contenido
3. Commit:
   ```bash
   git add DECISIONS.md
   git commit -m "docs: add architectural decision records (ADR)"


