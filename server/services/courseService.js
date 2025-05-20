const { pool } = require('../config/db');

/**
 * Список программ (purposes)
 */
async function listPurposes() {
  const [rows] = await pool.query(
    'SELECT id, name, count_day AS totalDays, calories FROM purpose'
  );
  return rows;
}

/**
 * Упражнения по программе
 */
async function listExercisesByPurpose(purposeId) {
  const [rows] = await pool.query(
    `SELECT e.id, e.name, e.about, e.how_to_do
       FROM purpose_config pc
       JOIN exercise e ON e.id = pc.exercise_id
      WHERE pc.purpose_id = ?
      ORDER BY pc.day, pc.id`,
    [purposeId]
  );
  return rows;
}

/**
 * Старт курса: создаём запись в journal
 */
async function startCourse(userId, purposeId) {
  const [result] = await pool.query(
    `INSERT INTO journal 
       (user_id, purpose_id, current_day, total_days, date_started, is_over)
     VALUES (?, ?, 1, (
        SELECT count_day FROM purpose WHERE id = ?
      ), NOW(), 0)
     ON DUPLICATE KEY UPDATE
       purpose_id = VALUES(purpose_id)`,
    [userId, purposeId, purposeId]
  );
  return {
    journalId: result.insertId || null,
    userId,
    purposeId,
    currentDay: 1
  };
}

/**
 * Пометить текущий день выполненным: ++current_day, флаг is_over
 */
async function markDayComplete(userId, journalId) {
  const [result] = await pool.query(
    `UPDATE journal
        SET current_day = current_day + 1,
            is_over = IF(current_day + 1 > total_days, 1, 0),
            date_ended = IF(current_day + 1 > total_days, NOW(), date_ended)
      WHERE id = ? AND user_id = ?`,
    [journalId, userId]
  );
  if (result.affectedRows === 0) {
    const err = new Error('Не удалось отметить день выполненным');
    err.statusCode = 400;
    throw err;
  }
  return { success: true };
}

/**
 * Получить прогресс пользователя по всем запущенным курсам
 */
async function getProgress(userId) {
  const [rows] = await pool.query(
    `SELECT j.id AS journalId,
            p.id AS purposeId,
            p.name,
            j.current_day AS currentDay,
            j.total_days  AS totalDays,
            j.is_over    AS isOver,
            j.date_started AS dateStarted,
            j.date_ended   AS dateEnded,
            j.burned_calories AS burnedCalories
       FROM journal j
  LEFT JOIN purpose p ON p.id = j.purpose_id
      WHERE j.user_id = ?`,
    [userId]
  );
  return rows;
}

module.exports = {
  listPurposes,
  listExercisesByPurpose,
  startCourse,
  markDayComplete,
  getProgress
};
