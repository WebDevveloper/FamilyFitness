const { pool } = require('../config/db');

async function listAllExercises() {
  const [rows] = await pool.query(`
    SELECT id, name
      FROM exercise
    ORDER BY name
  `);
  return rows;
}

module.exports = { listAllExercises };