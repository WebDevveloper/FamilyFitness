// const db = require('../config/db');
const { pool } = require('../config/db');

async function listMembers(parentId) {
  const [rows] = await pool.query(`
    SELECT u.id, u.name, p.name AS purpose_name, j.current_day, p.count_day AS total_days
      FROM journal j
      JOIN users u       ON u.id = j.user_id
      JOIN purpose p     ON p.id = j.purpose_id
     WHERE j.user_id IN (
       SELECT child_id FROM family_members WHERE parent_id = ?
     )
  `, [parentId]);
  return rows;
}

async function inviteChild(parentId, childId) {
  await pool.query(
    'INSERT INTO family_members (parent_id, child_id) VALUES (?, ?)',
    [parentId, childId]
  );
  return true;
}

async function removeChild(parentId, childId) {
  await pool.query(
    'DELETE FROM family_members WHERE parent_id = ? AND child_id = ?',
    [parentId, childId]
  );
}

module.exports = {
  listMembers,
  inviteChild,
  removeChild
};