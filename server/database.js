const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'data', 'noexcuse.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.message);
  } else {
    console.log('Connecté à la base de données SQLite NO-EXCUSE.');
    initialize();
  }
});

function initialize() {
  db.serialize(() => {
    // Table des visites
    db.run(`CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip TEXT,
      user_agent TEXT
    )`);

    // Table des commandes (Backlog)
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      customer_name TEXT,
      customer_phone TEXT,
      customer_region TEXT,
      customer_address TEXT,
      payment_method TEXT,
      items TEXT,
      total_amount INTEGER,
      promo_code TEXT,
      promo_discount INTEGER
    )`);

    // Table des admins
    db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`, () => {
      // Création d'un admin par défaut si la table est vide
      db.get("SELECT COUNT(*) as count FROM admins", [], (err, row) => {
        if (row && row.count === 0) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync('admin123', salt); // Mot de passe par défaut
          db.run("INSERT INTO admins (username, password) VALUES (?, ?)", ['admin', hash]);
          console.log('Admin par défaut créé (admin / admin123)');
        }
      });
    });
  });
}

module.exports = db;
