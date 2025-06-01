#!/bin/bash

# ────────────────────────────────────────────────
# Script de lancement de l'environnement DEV (détaché)
# ────────────────────────────────────────────────

echo "🔧 Lancement de l'environnement de développement en mode détaché..."

# Se placer dans le dossier du script (infrastructure)
cd "$(dirname "$0")"

# Lancer les services en arrière-plan
docker compose -f docker-compose.dev.yml up -d --build

echo "✅ Environnement de développement lancé."
echo "📦 Containers actifs :"
docker compose -f docker-compose.dev.yml ps
