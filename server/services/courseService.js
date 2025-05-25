const { pool } = require('../config/db');

/**
 * — список программ (purposes)
 */
async function listPurposes() {
  const [rows] = await pool.query(`
    SELECT id, name, count_day AS totalDays, calories
      FROM purpose
  `);
  return rows;
}

/**
 * — упражнения по программе
 * @param {number|string} purposeId
 */
async function listExercisesByPurpose(purposeId) {
  // 1) Преобразуем в число, на всякий случай
  const pid = Number(purposeId);
  if (isNaN(pid)) {
    const err = new Error('Неправильный параметр purposeId');
    err.statusCode = 400;
    throw err;
  }

  // 2) Передаём именно pid в массив параметров
  const [rows] = await pool.query(
    `SELECT
       pc.day,
       e.id,
       e.name,
       e.about,
       e.how_to_do
     FROM purpose_config pc
     JOIN exercise e ON e.id = pc.exercise_id
     WHERE pc.purpose_id = ?
     ORDER BY pc.day, pc.id`,
    [pid]
  );
  return rows;
}

/**
 * POST /courses/start
 * Старт новой попытки, если нет активной.
 */
async function startCourse(userId, purposeId) {
  // есть ли активная попытка?
  const [[active]] = await pool.query(
    `SELECT id FROM journal WHERE user_id=? AND purpose_id=? AND is_over=0`,
    [userId, purposeId]
  );
  if (active) {
    // возвращаем ту же запись
    return { journalId: active.id, userId, purposeId, currentDay: null };
  }
  // создаём новую запись
  const [{ insertId }] = await pool.query(
    `INSERT INTO journal 
       (user_id, purpose_id, current_day, date_started, is_over)
     VALUES (?, ?, 1, NOW(), 0)`,
    [userId, purposeId]
  );
  return { journalId: insertId, userId, purposeId, currentDay: 1 };
}

/**
 * POST /courses/reset
 * Завершает существующую попытку и создаёт новую.
 */
async function resetCourse(userId, purposeId) {
  // помечаем старую попытку завершённой
  await pool.query(
    `UPDATE journal 
        SET is_over=1, end_date=NOW()
      WHERE user_id=? AND purpose_id=? AND is_over=0`,
    [userId, purposeId]
  );
  // создаём новую
  const [{ insertId }] = await pool.query(
    `INSERT INTO journal 
       (user_id, purpose_id, current_day, date_started, is_over)
     VALUES (?, ?, 1, NOW(), 0)`,
    [userId, purposeId]
  );
  return { journalId: insertId, currentDay: 1 };
}

/**
 * Завершить текущий день: ++current_day, проверить конец курса
 */
async function markDayComplete(userId, journalId) {
  // 1) Получаем из journal текущий день и из purpose — общее число дней
  const [[rec]] = await pool.query(
    `SELECT j.current_day, p.count_day
       FROM journal j
       JOIN purpose p ON p.id = j.purpose_id
      WHERE j.id = ? AND j.user_id = ?`,
    [journalId, userId]
  );
  if (!rec) {
    const e = new Error('Попытка не найдена');
    e.statusCode = 404;
    throw e;
  }
  if (rec.current_day >= rec.count_day) {
    const e = new Error('Все дни уже пройдены');
    e.statusCode = 400;
    throw e;
  }
  // 2) Вычисляем новый день
  const nextDay = rec.current_day + 1;
  // 3) Обновляем запись: увеличиваем день, флаг is_over и end_date по необходимости
  await pool.query(
    `UPDATE journal j
       JOIN purpose p ON p.id = j.purpose_id
      SET
        j.current_day = ?,
        j.is_over     = IF(? >= p.count_day, 1, 0),
        j.end_date    = IF(? >= p.count_day, NOW(), j.end_date)
      WHERE j.id = ? AND j.user_id = ?`,
    [nextDay, nextDay, nextDay, journalId, userId]
  );
  return { currentDay: nextDay };
}

/**
 * GET /courses/progress
 * Сортировка свежих попыток первыми
 */
async function getProgress(userId) {
  const [rows] = await pool.query(
    `SELECT
       j.id AS journalId,
       p.id AS purposeId,
       p.name,
       j.current_day AS currentDay,
       p.count_day AS totalDays,
       j.is_over AS isOver,
       j.date_started AS dateStarted,
       j.end_date AS dateEnded
     FROM journal j JOIN purpose p ON p.id=j.purpose_id
    WHERE j.user_id=?
    ORDER BY j.date_started DESC`,
    [userId]
  );
  return rows;
}

module.exports = {
  listPurposes,
  listExercisesByPurpose,
  startCourse,
  resetCourse,
  markDayComplete,
  getProgress
};
