# Security (MovingWallet)

Este repositorio puede mostrar alertas de Dependabot / vulnerabilidades en dependencias.
La regla aquí es simple:

- **No bloqueamos el avance** del proyecto por alertas de dependencias
- **Pero sí las triamos** (registramos y priorizamos) de forma consistente

---

## Principios

1) **CI no se rompe por audit**
   - El objetivo del CI es detectar fallos funcionales y de integración.
   - Los audits son informativos salvo que decidamos lo contrario.

2) **Triage periódico y en PRs importantes**
   - Revisamos alertas de GitHub Dependabot.
   - Generamos un reporte reproducible con `pnpm audit`.

3) **Priorización**
   - Critical/High: revisar primero.
   - Moderate/Low: planificar actualización cuando toque.

---

## Dónde ver alertas

GitHub → Security → Dependabot alerts (rama default).

---

## Cómo actuar ante vulnerabilidades

Checklist:

1) Identificar paquete y rango de versiones afectadas.
2) Confirmar si:
   - es dependencia directa o transitoria
   - afecta a runtime o solo a dev
3) Probar upgrade mínimo (preferible).
4) Pasar tests + smoke.
5) Merge.

---

## Workflow de triage

Existe un workflow "Security Triage" que:
- instala dependencias
- ejecuta `pnpm audit` (sin romper CI)
- sube el reporte como artifact

Esto ayuda a revisar cambios de seguridad con contexto técnico, sin fricción.
