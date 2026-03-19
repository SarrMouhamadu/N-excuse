#!/bin/bash

# Configuration
PROJECT_DIR="/Users/mouhamadousarr/Desktop/mareme/NO-EXCUSE" # À adapter sur le VPS

echo "🚀 Mise à jour du projet NO-EXCUSE..."

# Aller dans le répertoire du projet
# cd $PROJECT_DIR

# Récupérer les derniers changements de GitHub
echo "📥 Récupération des nouveautés depuis GitHub..."
git pull origin main

# Reconstruire et redémarrer les conteneurs
echo "🛠️ Reconstruction de l'image Docker..."
docker-compose up -d --build

# Nettoyage des anciennes images
echo "🧹 Nettoyage des images inutilisées..."
docker image prune -f

echo "✅ Déploiement terminé ! Le site est en ligne."
