# ──────────────────────────────────────────────
# NO-EXCUSE — Dockerfile
# Serveur web : nginx:alpine (ultra-léger)
# ──────────────────────────────────────────────

FROM nginx:alpine

# Supprimer la page d'accueil par défaut de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier tous les fichiers du projet dans le dossier servi par nginx
COPY . /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx en mode foreground (non-daemon)
CMD ["nginx", "-g", "daemon off;"]
