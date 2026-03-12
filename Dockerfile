# Utiliser une image Nginx légère basée sur Alpine Linux pour des performances optimales
FROM nginx:alpine

# Copier tous les fichiers du projet dans le dossier par défaut de Nginx
COPY . /usr/share/nginx/html

# Exposer le port 80 pour le trafic HTTP interne
EXPOSE 80

# Commande par défaut pour lancer le serveur Nginx en avant-plan
CMD ["nginx", "-g", "daemon off;"]
