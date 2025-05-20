// /config/db.js
// require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);
console.log('✅ DB pool created on port', process.env.DB_PORT);

// function getPool() {
//   if (!pool) throw new Error('Pool is not initialized. Call initDB() first.');
//   return pool;
// }

module.exports = {
  pool: pool.promise()
};
