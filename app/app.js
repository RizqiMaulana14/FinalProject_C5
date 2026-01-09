require('dotenv').config();

console.log('ENV CHECK:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  db: process.env.DB_NAME
});

const express = require('express');
const path = require('path');
require('dotenv').config();
const db = require('./config/database'); // Import database

const app = express();
const PORT = process.env.APP_PORT || 3000;

// TEST KONEKSI DATABASE (TAMBAHKAN INI)
db.query('SELECT 1')
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});