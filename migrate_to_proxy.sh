#!/bin/bash
set -e

echo "============================================="
echo "   MIGRATION VERS REVERSE PROXY GLOBAL       "
echo "============================================="

if [ "$EUID" -ne 0 ]; then
  echo "Veuillez exécuter avec sudo : sudo ./migrate_to_proxy.sh"
  exit 1
fi

echo "[1/4] Création du réseau proxy..."
docker network create proxy-tier || true

echo "[2/4] Installation du Proxy Nginx + SSL Automatique..."
mkdir -p /home/ubuntu/proxy
cat << 'EOF' > /home/ubuntu/proxy/docker-compose.yml
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - conf:/etc/nginx/conf.d
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - certs:/etc/nginx/certs:ro
      - /var/run/docker.sock:/tmp/docker.sock:ro
    networks:
      - proxy-tier
    labels:
      com.github.nginx-proxy.nginx: "true"
    restart: always

  acme-companion:
    image: nginxproxy/acme-companion
    container_name: nginx-proxy-acme
    environment:
      - DEFAULT_EMAIL=sarrmahmoud232@gmail.com
      - NGINX_PROXY_CONTAINER=nginx-proxy
    volumes:
      - conf:/etc/nginx/conf.d
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - certs:/etc/nginx/certs:rw
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - acme:/etc/acme.sh
    networks:
      - proxy-tier
    depends_on:
      - nginx-proxy
    restart: always

volumes:
  conf:
  vhost:
  html:
  certs:
  acme:

networks:
  proxy-tier:
    external: true
EOF

echo "[3/4] Adaptation de SamaLook (Zéro Coupure)..."
if [ -d "/home/ubuntu/SamaLook" ]; then
    cd /home/ubuntu/SamaLook
    
    # Backup des fichiers originaux
    cp docker-compose.yml docker-compose.yml.backup
    cp nginx.conf nginx.conf.backup
    
    # On arrête SamaLook pour libérer les ports 80 et 443
    docker compose down || docker-compose down
    
    # 1. On supprime l'exposition des ports 80 et 443 de SamaLook
    sed -i '/- "80:80"/d' docker-compose.yml
    sed -i '/- "443:443"/d' docker-compose.yml
    
    # 2. On ajoute les variables d'environnement pour le Proxy
    sed -i '/depends_on:/i \    environment:\n      - VIRTUAL_HOST=samalook.com,www.samalook.com\n      - LETSENCRYPT_HOST=samalook.com,www.samalook.com\n      - VIRTUAL_PORT=80' docker-compose.yml
    
    # 3. On attache SamaLook au réseau proxy-tier
    echo -e "\nnetworks:\n  proxy-tier:\n    external: true\n  default:" >> docker-compose.yml
    sed -i '/container_name: samalook-app/a \    networks:\n      - proxy-tier\n      - default' docker-compose.yml

    # 4. On nettoie old certbot
    sed -i '/certbot:/,/certbot/d' docker-compose.yml

    # Nouveau fichier nginx.conf simplifié (port 80 proxyfié)
    cat << 'EOF' > nginx.conf
server {
    listen 80;
    server_name samalook.com www.samalook.com;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF
else
    echo "Dossier SamaLook introuvable, migration SamaLook sautée."
fi

echo "[4/4] Démarrage de TOUS les services..."
# Démarrage du proxy
cd /home/ubuntu/proxy
docker compose up -d

# Redémarrage de Samalook derrière le proxy
if [ -d "/home/ubuntu/SamaLook" ]; then
    cd /home/ubuntu/SamaLook
    docker compose up -d --build
fi

echo "============================================="
echo "   MIGRATION TERMINEE !                      "
echo "============================================="
echo "SamaLook tourne maintenant derrière le proxy."
echo "Il ne reste plus qu'à démarrer NO-EXCUSE avec ./deploy.sh"
