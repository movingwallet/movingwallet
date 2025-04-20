Perfecto, el documento está muy sólido y actualizado. A continuación te paso una **versión extendida con algunos añadidos útiles** para consolidar el documento `acciones_gpts.md`, incluyendo:

- ✅ Incorporación del archivo OpenAPI generado.
- 🧠 Mapeo directo acción → endpoint.
- 📦 Recomendación de despliegue en producción.
- 🔍 Mejores prácticas para pruebas y debugging de cada acción.

---

## 📌 Acciones Programables en el GPT de MovingWallet  
📅 **Última actualización: abril 2025**

---

### 🧠 Objetivo General

Construir un sistema de acciones progresivo que permita a un GPT personalizado actuar como:

- Asistente de desarrollo
- Documentador técnico
- Supervisor de consistencia
- Conector entre sistemas (GitHub, Google Sheets, Pinecone, etc.)

---

### 🔗 Acciones Implementadas y Endpoints (Resumen Rápido)

| Acción GPT                           | Endpoint API                          | Categoría             |
|-------------------------------------|----------------------------------------|------------------------|
| `ping_gpt_backend`                  | `/api/ping`                            | Test / debug          |
| `leer_archivo_github`              | `/api/github-file`                     | GitHub                |
| `leer_archivo_markdown_local`      | `/api/leer-md`                         | Markdown              |
| `crear_nueva_entrada_diario`       | `/api/crear-entrada`                   | Markdown              |
| `generar_commit_mensaje`           | `/api/commit`                          | Git / DevTools        |
| `buscar_en_documentos`             | `/api/pinecone`                        | Pinecone              |
| `agregar_tarea_excel`              | `/api/google-excel`                    | Google Sheets         |
| `leer_google_sheet`                | `/api/google-sheet`                    | Google Sheets         |
| `verificar_resultado_accion`       | `/api/verificar`                       | Supervisión           |
| `reintentar_accion`                | `/api/reintentar`                      | Supervisión           |
| `resumir_estado_actual`            | `/api/resumen`                         | Documentación         |
| `verificar_consistencia_documentacion`| `/api/consistencia`                 | Documentación         |
| `generar_presentacion_pitch`       | `/api/pitch`                           | Documentación         |
| `gpt_acceso_inteligente`           | `/api/router-inteligente`             | Enrutador GPT         |
| `leer_google_doc`                  | `/api/google-doc`                      | Google Docs           |

---

### 🔧 FASES DE DESARROLLO

_(Las fases ya están correctamente documentadas en tu versión actual, no necesitan cambio)_

---

### 🧩 Recomendaciones para Producción

- 📦 Subir `openapi.json` a `/docs/openapi_movingwallet_acciones.json` en el repo.
- 🛡️ Agregar tests a `/gpt-backend/__tests__/` para validar cada ruta.
- 🔁 Añadir `/health` con verificación de OpenAI, Pinecone y GitHub.
- 🔐 Usar variables `.env` para todas las APIs, nunca hardcodear keys.

---

### 🧪 Buenas prácticas para QA

| Prueba | ¿Cómo hacerla? |
|-------|----------------|
| Test de conexión | Usar `/api/ping` con mensaje personalizado |
| Validación de flujo | Ejecutar `gpt_acceso_inteligente` con input libre |
| Confirmación docs | Llamar `leer_archivo_markdown_local` + `crear_nueva_entrada_diario` |
| Verificación integración externa | Ejecutar `leer_archivo_github` con archivo público |
| Debug acciones encadenadas | Simular `reintentar_accion` luego de fallo forzado |

---
## ACUTAUL ACTION EN EL GPT PERSONALIZADO:

{
  "openapi": "3.1.0",
  "info": {
    "title": "MovingWallet – GPT Actions API",
    "version": "1.0.0",
    "description": "Todas las acciones programables del backend GPT de MovingWallet"
  },
  "servers": [
    { "url": "https://app.movingwallet.io" }
  ],
  "paths": {
    "/api/ping": {
      "post": {
        "operationId": "ping_gpt_backend",
        "summary": "Verifica conexión con el backend",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "mensaje": { "type": "string" }
                },
                "required": ["mensaje"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Echo desde el backend",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "respuesta": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/github-file": {
      "post": {
        "operationId": "leer_archivo_github",
        "summary": "Lee archivo crudo desde GitHub",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "url": { "type": "string" }
                },
                "required": ["url"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Contenido del archivo",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "contenido": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/leer-md": {
      "post": {
        "operationId": "leer_archivo_markdown_local",
        "summary": "Lee archivo markdown desde /docs/md",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "archivo": { "type": "string" }
                },
                "required": ["archivo"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Contenido markdown",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "contenido": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/crear-entrada": {
      "post": {
        "operationId": "crear_nueva_entrada_diario",
        "summary": "Agrega línea al final de archivo markdown",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "archivo": { "type": "string" },
                  "texto": { "type": "string" }
                },
                "required": ["archivo", "texto"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Confirmación",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "archivo": { "type": "string" },
                    "texto": { "type": "string" },
                    "status": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/commit": {
      "post": {
        "operationId": "generar_commit_mensaje",
        "summary": "Genera mensaje semántico para commit",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "resumen": { "type": "string" }
                },
                "required": ["resumen"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Commit sugerido",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "commit": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/pinecone": {
      "post": {
        "operationId": "buscar_en_documentos",
        "summary": "Busca por embeddings semánticos en Pinecone",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "pregunta": { "type": "string" }
                },
                "required": ["pregunta"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Resultado de búsqueda",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "respuesta": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/google-excel": {
      "post": {
        "operationId": "agregar_tarea_excel",
        "summary": "Añadir tarea a hoja de cálculo",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "tarea": { "type": "string" },
                  "prioridad": { "type": "string" },
                  "fecha": { "type": "string" }
                },
                "required": ["tarea", "prioridad", "fecha"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Tarea añadida",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": { "type": "string" },
                    "tarea": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/google-sheet": {
      "post": {
        "operationId": "leer_google_sheet",
        "summary": "Leer datos desde hoja de cálculo",
        "requestBody": {
          "required": false,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "hoja": {
                    "type": "string",
                    "description": "Nombre de la hoja específica a leer (opcional)"
                  },
                  "rango": {
                    "type": "string",
                    "description": "Rango de celdas a leer (ej. A1:B10)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Datos de hoja",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "datos": {
                      "type": "array",
                      "items": {
                        "type": "array",
                        "items": { "type": "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/verificar": {
      "post": {
        "operationId": "verificar_resultado_accion",
        "summary": "Verifica si una acción anterior tuvo éxito",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "accion": { "type": "string" },
                  "resultadoEsperado": { "type": "string" }
                },
                "required": ["accion", "resultadoEsperado"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Resultado de verificación",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": { "type": "string" },
                    "accion": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/reintentar": {
      "post": {
        "operationId": "reintentar_accion",
        "summary": "Vuelve a intentar una acción fallida con el mismo input",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "nombreAccion": { "type": "string" },
                  "input": { "type": "object" }
                },
                "required": ["nombreAccion", "input"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Resultado del reintento",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": { "type": "string" },
                    "nombreAccion": { "type": "string" },
                    "input": { "type": "object" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/resumen": {
      "post": {
        "operationId": "resumir_estado_actual",
        "summary": "Resumen técnico del estado actual del proyecto",
        "responses": {
          "200": {
            "description": "Resumen generado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "resumen": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/consistencia": {
      "post": {
        "operationId": "verificar_consistencia_documentacion",
        "summary": "Verifica alineación entre roadmap, objetivos y documentación",
        "responses": {
          "200": {
            "description": "Resultado del chequeo",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "consistencia": { "type": "string" },
                    "archivos": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/pitch": {
      "post": {
        "operationId": "generar_presentacion_pitch",
        "summary": "Genera un resumen técnico tipo pitch del proyecto",
        "responses": {
          "200": {
            "description": "Pitch generado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "pitch": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/router-inteligente": {
      "post": {
        "operationId": "gpt_acceso_inteligente",
        "summary": "Acción compuesta que redirige a la ruta adecuada",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "consulta": { "type": "string" }
                },
                "required": ["consulta"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ruta recomendada por el GPT",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "tipoDetectado": { "type": "string" },
                    "sugerencia": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/google-doc": {
      "post": {
        "operationId": "leer_google_doc",
        "summary": "Lee un documento técnico desde Google Docs",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "docId": {
                    "type": "string",
                    "description": "ID del documento (no la URL completa)"
                  }
                },
                "required": ["docId"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Contenido leído del Google Doc",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "contenido": { "type": "string" },
                    "docId": { "type": "string" },
                    "status": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}