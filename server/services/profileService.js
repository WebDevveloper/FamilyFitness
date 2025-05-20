// const db = require('../config/db');
const { pool } = require('../config/db');

async function getProfile(userId) {
  const [rows] = await pool.query(
    'SELECT id, name, avatar, role FROM users WHERE id = ?',
    [userId]
  );
  return rows[0] || null;
}

async function updateProfile(userId, { name, avatar }) {
  await pool.query(
    'UPDATE users SET name = ?, avatar = ? WHERE id = ?',
    [name, avatar, userId]
  );
  return { message: 'Профиль обновлён' };
}

module.exports = { getProfile, updateProfile };