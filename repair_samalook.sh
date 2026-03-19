#!/bin/bash
# Script de réparation pour SamaLook (Suppression des doublons yaml)

SAMALOOK_DIR="/home/ubuntu/SamaLook"

if [ ! -d "$SAMALOOK_DIR" ]; then
    echo "Erreur: $SAMALOOK_DIR introuvable."
    exit 1
fi

echo "🚀 Réparation du fichier docker-compose.yml de SamaLook..."

cat << 'EOF' > "$SAMALOOK_DIR/docker-compose.yml"
services:
  backend:
    build: ./server
    container_name: samalook-backend
    volumes:
      - ./server:/app
      - /app/node_modules
    environment:
      - NODE_ENV=production
    networks:
      - default
    restart: always

  frontend:
    build: ./client
    container_name: samalook-app
    environment:
      - VIRTUAL_HOST=samalook.com,www.samalook.com
      - LETSENCRYPT_HOST=samalook.com,www.samalook.com
      - VIRTUAL_PORT=80
    depends_on:
      - backend
    networks:
      - proxy-tier
      - default
    restart: always

networks:
  proxy-tier:
    external: true
  default:
EOF

echo "✅ Fichier réparé. Redémarrage de SamaLook..."
cd "$SAMALOOK_DIR"
sudo docker compose up -d --build
echo "✨ Terminé ! SamaLook est de nouveau opérationnel."
