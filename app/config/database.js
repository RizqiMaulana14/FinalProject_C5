// TODO: Buat koneksi pool MySQL disini menggunakan Environment Variable (process.env)
const mysql = require('mysql2');
require('dotenv').config();

console.log('🔍 Database Config:');
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_PASS:', process.env.DB_PASS ? '***' : 'NOT SET');
console.log('  DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();