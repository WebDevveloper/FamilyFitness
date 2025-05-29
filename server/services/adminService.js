const { pool } = require('../config/db');

async function listCourses() {
  const [rows] = await pool.query(`
    SELECT id, name, count_day   AS totalDays,
                 calories
      FROM purpose
  `);
  return rows;
}

async function createCourse({ name, count_day, calories }) {
  const [{ insertId }] = await pool.query(
    `INSERT INTO purpose (name, count_day, calories)
         VALUES (?, ?, ?)`,
    [name, count_day, calories]
  );
  return { id: insertId, name, totalDays: count_day, calories };
}

async function updateCourse(id, fields) {
  const updates = [];
  const params  = [];

  if (fields.name !== undefined) {
    updates.push('name = ?');
    params.push(fields.name);
  }
  if (fields.count_day !== undefined) {
    updates.push('count_day = ?');
    params.push(fields.count_day);
  }
  if (fields.calories !== undefined) {
    updates.push('calories = ?');
    params.push(fields.calories);
  }
  if (!updates.length) return;

  params.push(id);
  await pool.query(
    `UPDATE purpose
        SET ${updates.join(', ')}
      WHERE id = ?`,
    params
  );
  return { id, ...fields };
}

async function deleteCourse(id) {
  await pool.query(
    `DELETE FROM purpose WHERE id = ?`,
    [id]
  );
}

async function listExercises(purposeId) {
  const [rows] = await pool.query(
    `SELECT
       pc.id      AS configId,
       pc.day,
       e.id       AS exerciseId,
       e.name
     FROM purpose_config pc
     JOIN exercise e ON e.id = pc.exercise_id
     WHERE pc.purpose_id = ?
     ORDER BY pc.day, pc.id
    `,
    [purposeId]
  );
  return rows;
}

async function addExercise(purposeId, exerciseId, day) {
  const [{ insertId }] = await pool.query(
    `INSERT INTO purpose_config
         (purpose_id, exercise_id, day)
       VALUES (?, ?, ?)`,
    [purposeId, exerciseId, day]
  );
  return { configId: insertId, purposeId, exerciseId, day };
}

async function removeExercise(configId) {
  await pool.query(
    `DELETE FROM purpose_config WHERE id = ?`,
    [configId]
  );
}

module.exports = {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  listExercises,
  addExercise,
  removeExercise,
};