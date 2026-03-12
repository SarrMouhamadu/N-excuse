# NO-EXCUSE ✦ Streetwear E-Commerce

**NO EXCUSE** est une application web e-commerce ultra-légère et performante conçue pour une marque de vêtements streetwear.

Le projet a été pensé pour offrir une expérience utilisateur haut de gamme et fluide, sans dépendre de lourds frameworks frontend ni de systèmes de paiements complexes. L'approche choisie privilégie le contact humain avec un tunnel de conversion redirigeant le client directement sur WhatsApp.

---

## 🚀 Fonctionnalités Principales

- **Boutique Dynamique** : Les produits sont générés et filtrés instantanément via JavaScript.
- **Paiement Direct (WhatsApp)** : Le panier compile les articles, les quantités, les informations du client ainsi que son mode de paiement préféré (Wave, Orange Money, Cash) et génère un bon de commande pré-rempli envoyé directement au vendeur via WhatsApp.
- **Animations Modernes** : 
  - Effets d'apparition fluides au défilement (Scroll Reveal).
  - Bandeau textuel défilant infini (`NO EXCUSE ✦ JUST RESULT`).
  - Carrousel d'images automatisé tournant en boucle à base de CSS pur.
  - Animations de survol "Premium" avec ombres douces et soulèvements.
- **Système de codes promotionnels** : Permet au client de soumettre des codes promo (ex: `NOEXCUSE10`) pour obtenir une réduction instantanée sur le total global.

---

## 🛠 Architecture & Technologies

Ce projet est un "Static Site" (Site Statique) de type MVP (Minimum Viable Product).

- **HTML5** : Structure sémantique propre.
- **CSS3 (Vanilla)** : Un design totalement personnalisé sans l'utilisation de Bootstrap ou Tailwind, incluant des variables root, Grid et Flexbox pour la responsivité.
- **JavaScript (Vanilla)** :
  - `data.js` : Joue le rôle de base de données (JSON-like) contenant le catalogue de produits, les tailles, prix, et chemins des images en haute résolution.
  - `app.js` : Gère le moteur logique du site (Observer API pour l'animation au scroll, la gestion complète du panier, la génération du ticket virtuel côté navigateur).

---

## 📦 Installation & Déploiement

Aucune installation complexe (Node.js/npm) n'est requise puisque le projet est 100% statique.

1. Clonez ce dépôt localement :
   ```bash
   git clone https://github.com/SarrMouhamadu/N-excuse.git
   ```

2. Vous pouvez ouvrir simplement le fichier `index.html` dans n'importe quel navigateur, ou utiliser un petit serveur de développement pour tester l'application :
   ```bash
   # Via Python
   python3 -m http.server 8000
   
   # Via PHP
   php -S localhost:8000
   ```

---

## 🎨 Modification des données

Pour mettre à jour les produits, ouvrez simplement le fichier `data.js` et modifiez l'objet `PRODUCTS` :

```javascript
{
  id: 1, 
  name: 'T-shirt Noir', 
  cat: 'tshirt', 
  price: 8000, 
  soldOut: false,
  sizes: ['S','M','L','XL','XXL'],
  img: 'tshirt-noir.png', // L'image doit se trouver à la racine
  gallery: ['tshirt-noir.png', 'tshirt-noir-dos.jpeg']
}
```

---

## 📞 Contact Vendeur
- **WhatsApp :** +221 77 398 52 55 / +221 77 590 64 83
- **Emplacement :** Dakar

*© 2026 No Excuse. Tous droits réservés.*
