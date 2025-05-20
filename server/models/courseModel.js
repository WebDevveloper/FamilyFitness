// server/models/courseModel.js
const { getPool } = require('../config/db');

/**
 * Возвращает все упражнения данного типа (cardio/strength/lose_weight)
 */
async function getExercisesByType(typeColumn) {
  const pool = getPool();
  const sql  = `SELECT id, name, about, how_to_do
                FROM exercise
                WHERE ${typeColumn} = 1`;
  const [rows] = await pool.query(sql);
  return rows;
}

/**
 * Добавляет или обновляет запись в journal о выполнении дня
 */
async function upsertJournal(userId, purposeId, day, date) {
  const pool = getPool();
  // Попытаться обновить
  const [res] = await pool.execute(
    `UPDATE journal
       SET current_day = ?, 
           is_over = 1,
           end_date = ?
     WHERE user_id = ? AND purpose_id = ?`,
    [day, date, userId, purposeId]
  );
  if (res.affectedRows === 0) {
    // Если не было — вставляем новую запись
    await pool.execute(
      `INSERT INTO journal
         (user_id, purpose_id, current_day, date_started, end_date, is_over)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [userId, purposeId, day, date, date]
    );
  }
}

/**
 * Возвращает список курсов (целей) с настройками
 */
async function getAllPurposes() {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT id, name, count_day, calories FROM purpose'
  );
  return rows;
}

/**
 * Возвращает конфигурацию упражнений для курса и дня
 */
async function getPurposeConfig(purposeId, day) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT e.id, e.name, e.about, e.how_to_do
     FROM purpose_config pc
     JOIN exercise e ON pc.exercise_id = e.id
     WHERE pc.purpose_id = ? AND pc.day = ?`,
    [purposeId, day]
  );
  return rows;
}

/**
 * Возвращает статистику из journal для пользователя
 */
async function getUserJournal(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT j.purpose_id, j.current_day, j.date_started, j.end_date, j.is_over,
            p.name as purpose_name
     FROM journal j
     JOIN purpose p ON j.purpose_id = p.id
     WHERE j.user_id = ?`,
    [userId]
  );
  return rows;
}

module.exports = {
  getExercisesByType,
  upsertJournal,
  getAllPurposes,
  getPurposeConfig,
  getUserJournal,
};
