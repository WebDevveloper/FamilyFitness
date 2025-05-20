const { getPool } = require('../config/db');

/**
 * Добавляет связь родитель–ребёнок
 * @param {number} parentId
 * @param {number} childId
 */
async function addChild(parentId, childId) {
  const pool = getPool();
  await pool.execute(
    'INSERT INTO family_members (parent_id, child_id) VALUES (?, ?)',
    [parentId, childId]
  );
}

/**
 * Удаляет связь родитель–ребёнок
 * @param {number} parentId
 * @param {number} childId
 */
async function removeChild(parentId, childId) {
  const pool = getPool();
  await pool.execute(
    'DELETE FROM family_members WHERE parent_id = ? AND child_id = ?',
    [parentId, childId]
  );
}

/**
 * Возвращает список детей для данного родителя
 * @param {number} parentId
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
async function getChildren(parentId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT u.id, u.name 
     FROM family_members fm
     JOIN users u ON fm.child_id = u.id
     WHERE fm.parent_id = ?`,
    [parentId]
  );
  return rows;
}

module.exports = {
  addChild,
  removeChild,
  getChildren,
};