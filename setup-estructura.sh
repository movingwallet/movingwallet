#!/bin/bash

echo "🧱 Creando estructura base de MovingWallet..."

# Crear carpetas del monorepo
mkdir -p movingwallet/apps/frontend/src/{components,layout,hooks,pages/api/ia,services,state,config,styles,utils,__tests__,cypress}
mkdir -p movingwallet/apps/gpt-backend/{actions/{github,google,pinecone,documentacion,supervisores,generales},routes,services,utils,data,__tests__,health}
mkdir -p movingwallet/apps/hardhat/{contracts,scripts,test}

mkdir -p movingwallet/packages/{ui,config,lib,types/schemas,logger,integrations/{coingecko,etherscan,solana,bitcoin,defi}}
mkdir -p movingwallet/docs
mkdir -p movingwallet/.github/workflows

# Crear archivos base
touch movingwallet/{.env,.env.development,.env.staging,.env.production,package.json,turbo.json,tsconfig.json,README.md}
touch movingwallet/.github/workflows/deploy.yml

# Documentación inicial
touch movingwallet/docs/{documentacion_tecnica_movingwallet.md,acciones_gpt_movingwallet.md,estructura_proyecto_movingwallet_v2.md,guia_tecnica_movingwallet.md,roadmap_funcional.md,requisitos_previos.md,seguridad_privacidad.md,casos_uso_usuario.md}

echo "✅ Estructura creada correctamente. Listo para trabajar."
