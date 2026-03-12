# NO-EXCUSE ✦ Streetwear E-Commerce

**NO EXCUSE** est une application web e-commerce légère et performante conçue pour une marque de vêtements streetwear.

Le projet a été pensé pour offrir une expérience utilisateur haut de gamme, sans dépendre de frameworks lourds ni de systèmes de paiement complexes. Le tunnel de conversion redirige directement le client vers WhatsApp pour une prise de commande humaine et immédiate.

---

## 🚀 Fonctionnalités

- **Boutique dynamique** : Produits générés et filtrés instantanément par catégorie.
- **Tunnel de commande WhatsApp** : Récapitulatif complet envoyé directement au vendeur via WhatsApp (nom, adresse, articles, paiement).
- **Codes promotionnels** : Réduction instantanée appliquée sur le total (ex: `NOEXCUSE10`, `WELCOME15`).
- **Animations modernes** :
  - Apparition fluide au défilement *(Scroll Reveal)*
  - Bandeau textuel infini *(NO EXCUSE ✦ JUST RESULT)*
  - Carrousel d'images automatisé en boucle
  - Effets de survol *(hover)* avec ombres douces

---

## 🛠 Architecture & Technologies

Site statique — aucune dépendance externe (pas de Node.js, pas de framework).

- **HTML5** — Structure sémantique
- **CSS3 (Vanilla)** — Variables CSS, Grid, Flexbox, animations `@keyframes`
- **JavaScript (Vanilla)** :
  - `data.js` : Catalogue produits (base de données JSON statique)
  - `app.js` : Logique complète (panier, galerie, promo, Intersection Observer)

---

## 📦 Installation

### Option 1 — Ouvrir directement
```bash
git clone https://github.com/SarrMouhamadu/N-excuse.git
cd N-excuse
open index.html
```

### Option 2 — Docker (recommandé)
```bash
# Construire l'image
docker build -t no-excuse:latest .

# Lancer le conteneur
docker run -d -p 8081:80 --name no-excuse no-excuse:latest
```
Puis ouvrez **http://localhost:8081** dans votre navigateur.

---

## 🎨 Modifier le catalogue

Ouvrez `data.js` et ajoutez ou modifiez un produit dans le tableau `PRODUCTS` :

```javascript
{
  id: 1,
  name: 'T-shirt Noir',
  cat: 'tshirt',       // tshirt | hoodie | bonnet | accessoire
  price: 8000,         // Prix en CFA
  soldOut: false,
  sizes: ['S','M','L','XL','XXL'],
  img: 'tshirt-noir.png',
  gallery: ['tshirt-noir.png', 'tshirt-noir-dos.jpeg']
}
```

---

## 📞 Contact
- **WhatsApp :** +221 77 398 52 55 / +221 77 590 64 83
- **Localisation :** Dakar, Sénégal

*© 2026 No Excuse. Tous droits réservés.*
