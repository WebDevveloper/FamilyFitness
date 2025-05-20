const bcrypt = require('bcrypt');
// const db     = require('../config/db');
const { pool } = require('../config/db');

async function createUser({ name, password, role = 'parent' }) {
  const hash = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    'INSERT INTO users (name, password, role) VALUES (?, ?, ?)',
    [name, hash, role]
  );
  return { id: result.insertId, name, role };
}

async function findUserByName(name) {
  const [rows] = await pool.query(
    'SELECT id, name, password, role FROM users WHERE name = ?',
    [name]
  );
  return rows[0] || null;
}

module.exports = { createUser, findUserByName };