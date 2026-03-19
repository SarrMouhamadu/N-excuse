const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'no-excuse-super-secret-key'; // À changer en production

app.use(cors());
app.use(express.json());

// --- ROUTES PUBLIQUES ---

// Log d'une visite
app.post('/api/visit', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  db.run("INSERT INTO visits (ip, user_agent) VALUES (?, ?)", [ip, userAgent], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Log d'une commande
app.post('/api/order', (req, res) => {
  const { name, phone, region, address, payment, items, total, promoCode, promoDiscount } = req.body;
  if (!name || !phone || !items || !total) return res.status(400).json({ error: 'Missing data' });

  db.run(`INSERT INTO orders (customer_name, customer_phone, customer_region, customer_address, payment_method, items, total_amount, promo_code, promo_discount) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [name, phone, region, address, payment, JSON.stringify(items), total, promoCode, promoDiscount], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, orderId: this.lastID });
    }
  );
});

// Login Admin
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM admins WHERE username = ?", [username], (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ success: true, token });
  });
});

// --- ROUTES PRIVEES (ADMIN) ---

// Middleware d'authentification
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token manquant' });
  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token invalide' });
    req.admin = decoded;
    next();
  });
};

// Statistiques globales
app.get('/api/admin/stats', auth, (req, res) => {
  const stats = {};
  db.get("SELECT COUNT(*) as total FROM visits", (err, row) => {
    stats.totalVisits = row.total;
    db.get("SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM orders", (err, row) => {
      stats.totalOrders = row.total;
      stats.totalRevenue = row.revenue || 0;
      db.all("SELECT * FROM orders ORDER BY timestamp DESC LIMIT 100", (err, rows) => {
        stats.recentOrders = rows;
        res.json(stats);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur NO-EXCUSE démarré sur le port ${PORT}`);
});
