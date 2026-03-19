#!/bin/bash
set -e

echo "============================================="
echo "   CORRECTION YAML SAMALOOK                  "
echo "============================================="

if [ "$EUID" -ne 0 ]; then
  echo "Veuillez exécuter avec sudo : sudo ./fix_samalook.sh"
  exit 1
fi

if [ -d "/home/ubuntu/SamaLook" ]; then
    cd /home/ubuntu/SamaLook

    echo "Application du bon format docker-compose.yml..."
    cat << 'EOF' > docker-compose.yml
services:
  web:
    build: .
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    restart: always
    container_name: samalook-app
    depends_on:
      - backend
    environment:
      - VIRTUAL_HOST=samalook.com,www.samalook.com
      - LETSENCRYPT_HOST=samalook.com,www.samalook.com
      - VIRTUAL_PORT=80
    networks:
      - proxy-tier
      - default

  backend:
    build: ./server
    container_name: samalook-backend
    volumes:
      - ./server/products.json:/app/products.json
      - ./server/uploads:/app/uploads
    restart: always

networks:
  proxy-tier:
    external: true
EOF

    echo "Redémarrage de SamaLook..."
    docker compose up -d --build
    echo "✅ SamaLook réparé et redémarré avec succès !"
else
    echo "Dossier /home/ubuntu/SamaLook introuvable."
fi
