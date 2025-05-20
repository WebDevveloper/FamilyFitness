// server/models/userModel.js
const { getPool } = require('../config/db');

async function createUser({ name, password, role }) {
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT INTO users (name, password, role) VALUES (?, ?, ?)',
    [name, password, role]
  );
  return { id: result.insertId, name, role };
}

async function findUserByName(name) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, password, role FROM users WHERE name = ?',
    [name]
  );
  return rows[0];
}

module.exports = { createUser, findUserByName };