#!/bin/bash

# Script pour automatiser l'activation du SSL une fois que le nom de domaine pointe bien vers le VPS.
# Ce script doit être lancé depuis le VPS dans le dossier N-excuse.

echo "================================================="
echo "   ACTIVATION DU HTTPS (Certbot + Docker)        "
echo "================================================="

# Étape 1 : Vérifier si on est en sudo
if [ "$EUID" -ne 0 ]; then
  echo "Veuillez lancer ce script avec sudo : sudo ./activer_ssl.sh"
  exit 1
fi

# Étape 2 : Libérer le port 80 en arrêtant Nginx temporairement
echo "1. Arrêt du conteneur actuel pour libérer le port 80..."
docker compose down || docker-compose down

# Étape 3 : Lancer Certbot en mode autonome pour obtenir les certificats
echo "2. Lancement de Certbot (Génération du certificat SSL)..."
certbot certonly --standalone -d no-excuse.shop -d www.no-excuse.shop --agree-tos -m sarrmahmoud232@gmail.com -n

# Vérifier si Certbot a réussi
if [ $? -ne 0 ]; then
    echo "================================================="
    echo "ERREUR : Certbot a échoué."
    echo "Vérifiez que votre domaine (no-excuse.shop) pointe bien vers cette adresse IP (135.125.47.92)."
    echo "Si la propagation DNS n'est pas finie, attendez quelques heures."
    echo "================================================="
    echo "Redémarrage du site en mode normal (HTTP)..."
    docker compose up -d --build
    exit 1
fi

# Étape 4 : Activer la configuration SSL
echo "3. Application de la configuration SSL (Nginx & Docker)..."
cp nginx-ssl.conf nginx.conf
cp docker-compose-ssl.yml docker-compose.yml

# Étape 5 : Redémarrer le conteneur avec HTTPS actif
echo "4. Redémarrage du serveur web avec HTTPS..."
docker compose up -d --build

echo "================================================="
echo "✅ FELICITATIONS ! Votre site est maintenant en HTTPS."
echo "Allez vérifier sur : https://no-excuse.shop"
echo "================================================="
