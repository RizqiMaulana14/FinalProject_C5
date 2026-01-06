// TODO: Ini adalah titik masuk aplikasi, setup Express, Middleware, dan Server Listener disini
const express = require('express');
const app = express();

const PORT = process.env.APP_PORT || 3000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Aplikasi Book Management Berjalan!');
});

// listener
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
