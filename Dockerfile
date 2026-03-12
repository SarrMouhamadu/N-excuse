# ──────────────────────────────────────────────
# NO-EXCUSE — Dockerfile
# Serveur web : nginx:alpine (ultra-léger)
# ──────────────────────────────────────────────

FROM nginx:alpine

# Supprimer la page d'accueil par défaut de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier tous les fichiers du projet dans le dossier servi par nginx
COPY . /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer nginx en mode foreground (non-daemon)
CMD ["nginx", "-g", "daemon off;"]
