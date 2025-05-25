const { pool } = require('../config/db');

/**
 * Возвращает список программ (purposes)
 */
async function listPurposes() {
  const [rows] = await pool.query(
    `SELECT
       id,
       name,
       count_day    AS totalDays,
       calories
     FROM purpose`
  );
  return rows;
}

/**
 * Возвращает упражнения для конкретной программы
 */
async function listExercisesByPurpose(purposeId) {
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
    [purposeId]
  );
  return rows;
}

/**
 * Старт (или повторный старт) курса:
 * - если запись в journal нет → вставляем новую;
 * - если есть и is_over=0 → возвращаем существующую (продолжение);
 * - если есть и is_over=1 → сбрасываем под курс заново (обновляем dates и флаг).
 */
async function startCourse(userId, purposeId) {
  // ищем в журнале
  const [[row]] = await pool.query(
    `SELECT id, is_over
       FROM journal
      WHERE user_id = ? AND purpose_id = ?`,
    [userId, purposeId]
  );

  if (!row) {
    // нет записи — создаём новую
    const [{ insertId }] = await pool.query(
      `INSERT INTO journal
         (user_id, purpose_id, current_day, date_started, is_over)
       VALUES (?, ?, 1, NOW(), 0)`,
      [userId, purposeId]
    );
    return { journalId: insertId, userId, purposeId, currentDay: 1 };
  }

  if (row.is_over === 0) {
    // курс уже в процессе — продолжаем
    return { journalId: row.id, userId, purposeId, currentDay: null };
  }

  // курс завершён — сбрасываем запись для повторного старта
  await pool.query(
    `UPDATE journal
        SET current_day  = 1,
            is_over      = 0,
            date_started = NOW(),
            end_date     = NULL
      WHERE id = ?`,
    [row.id]
  );
  return { journalId: row.id, userId, purposeId, currentDay: 1 };
}

/**
 * Явный сброс курса (кнопка «Начать сначала»)
 */
async function resetCourse(userId, purposeId) {
  const [res] = await pool.query(
    `UPDATE journal
        SET current_day  = 1,
            is_over      = 0,
            date_started = NOW(),
            end_date     = NULL
      WHERE user_id = ? AND purpose_id = ?`,
    [userId, purposeId]
  );
  if (res.affectedRows === 0) {
    const err = new Error('Нельзя сбросить несуществующий курс');
    err.statusCode = 400;
    throw err;
  }
  return { success: true };
}

/**
 * Отметить текущий день выполненным:
 * увеличиваем current_day, проверяем окончание, выставляем end_date
 */
async function markDayComplete(userId, journalId) {
  const [result] = await pool.query(
    `UPDATE journal j
       JOIN purpose p ON p.id = j.purpose_id
        SET j.current_day = j.current_day + 1,
            j.is_over     = IF(j.current_day + 1 > p.count_day, 1, 0),
            j.end_date    = IF(j.current_day + 1 > p.count_day, NOW(), j.end_date)
     WHERE j.id = ? AND j.user_id = ?`,
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
 * Прогресс пользователя: возвращаем массив записей journal + данные из purpose
 */
async function getProgress(userId) {
  const [rows] = await pool.query(
    `SELECT
       j.id           AS journalId,
       p.id           AS purposeId,
       p.name         AS name,
       j.current_day  AS currentDay,
       p.count_day    AS totalDays,
       j.is_over      AS isOver,
       j.date_started AS dateStarted,
       j.end_date     AS dateEnded
     FROM journal j
     JOIN purpose p ON p.id = j.purpose_id
    WHERE j.user_id = ?`,
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
