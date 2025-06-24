const { pool } = require('../config/db');

// --- Курсы ---
async function listCourses() {
  const [rows] = await pool.query(`
    SELECT id, name, count_day AS totalDays, calories,
           description, image_url, is_published
      FROM purpose
  `);
  return rows;
}

async function createCourse({ name, count_day, calories, description, image_url }) {
  const [{ insertId }] = await pool.query(`
    INSERT INTO purpose
      (name, count_day, calories, description, image_url)
    VALUES (?, ?, ?, ?, ?)
  `, [name, count_day, calories || null, description || null, image_url || null]);
  return { id: insertId, name, totalDays: count_day, calories, description, image_url, is_published: 0 };
}

async function updateCourse(id, fields) {
  const allowed = ['name','count_day','calories','description','image_url'];
  const sets = [], params = [];
  for (let key of allowed) {
    if (key in fields) {
      sets.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }
  if (!sets.length) return listCourses().then(cs => cs.find(c=>c.id===id));
  params.push(id);
  await pool.query(`UPDATE purpose SET ${sets.join(', ')} WHERE id = ?`, params);
  return listCourses().then(cs => cs.find(c=>c.id===id));
}

async function deleteCourse(id) {
  // лучше маркировать, но тут полноценное удаление
  await pool.query(`DELETE FROM purpose WHERE id = ?`, [id]);
}

async function togglePublishCourse(id, publish) {
  await pool.query(
    `UPDATE purpose SET is_published = ? WHERE id = ?`,
    [ publish?1:0, id ]
  );
}

// --- Упражнения в курсе ---
async function listExercisesByCourse(purposeId) {
  const [rows] = await pool.query(
    `SELECT
       pc.id      AS configId,
       pc.day,
       e.id       AS exerciseId,
       e.name
     FROM purpose_config pc
     JOIN exercise e ON e.id = pc.exercise_id
     WHERE pc.purpose_id = ?
     ORDER BY pc.day, pc.id`,
    [purposeId]
  );
  return rows;
}

async function addExercise(purposeId, exerciseId, day) {
  const [{ insertId }] = await pool.query(`
    INSERT INTO purpose_config (purpose_id, exercise_id, day)
    VALUES (?, ?, ?)
  `, [purposeId, exerciseId, day]);
  return { configId: insertId, purposeId, exerciseId, day };
}

async function removeExercise(configId) {
  await pool.query(`DELETE FROM purpose_config WHERE id = ?`, [configId]);
}

// --- Пользователи ---
async function listUsers() {
  const [rows] = await pool.query(`
    SELECT
      u.id,
      u.name,
      u.role,
      -- перечисляем через GROUP_CONCAT курсы по флагу
      GROUP_CONCAT(DISTINCT CASE WHEN j.is_over = 0 THEN p.name END) AS activeCourses,
      GROUP_CONCAT(DISTINCT CASE WHEN j.is_over = 1 THEN p.name END) AS doneCourses
    FROM users u
    LEFT JOIN journal j ON j.user_id = u.id
    LEFT JOIN purpose p ON p.id = j.purpose_id
    WHERE u.role <> 'admin'
    GROUP BY u.id, u.name, u.role
  `);
  return rows.map(r => ({
    ...r,
    activeCourses: r.activeCourses ? r.activeCourses.split(',') : [],
    doneCourses:   r.doneCourses   ? r.doneCourses.split(',')   : []
  }));
}

module.exports = {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  togglePublishCourse,

  listExercisesByCourse,
  addExercise,
  removeExercise,

  listUsers,
};
