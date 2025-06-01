#!/bin/bash

echo "🔁 Déploiement du bot Discord en production..."
cd infrastructure

echo "📦 Arrêt des services existants..."
docker compose -f docker-compose.prod.yml down

echo "🔄 Reconstruction et redémarrage des services..."
docker compose -f docker-compose.prod.yml up -d --build

echo "✅ Déploiement terminé."
