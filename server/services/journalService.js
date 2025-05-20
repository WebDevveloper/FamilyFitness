const { pool } = require('../config/db');

async function getJournal(userId, purposeId) {
  const [rows] = await pool.query(
    `SELECT * 
       FROM journal
      WHERE user_id = ? AND purpose_id = ?`,
    [userId, purposeId]
  );
  return rows[0] || null;
}

async function markDayComplete(userId, purposeId, day) {
  await pool.query(
    `UPDATE journal
        SET current_day = ?, is_over = IF(current_day = ?, 1, 0)
      WHERE user_id = ? AND purpose_id = ?`,
    [day, day, userId, purposeId]
  );
}

async function resetJournal(userId, purposeId) {
  await pool.query(
    `UPDATE journal
        SET current_day = 1, is_over = 0, date_started = NOW()
      WHERE user_id = ? AND purpose_id = ?`,
    [userId, purposeId]
  );
}

module.exports = { getJournal, markDayComplete, resetJournal };