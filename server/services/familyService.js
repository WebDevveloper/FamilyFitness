// server/services/familyService.js

const { pool } = require('../config/db');

async function listMembers(parentId) {
  const [rows] = await pool.query(
    `SELECT
       u.id           AS childId,
       u.name         AS name,
       p.name         AS purpose_name,
       COALESCE(j.current_day, 0) AS current_day,
       p.count_day    AS total_days
     FROM family_members fm
     JOIN users u       ON u.id = fm.child_id
     LEFT JOIN journal j
       ON j.user_id   = fm.child_id
      AND j.is_over   = 0
     LEFT JOIN purpose p
       ON p.id        = j.purpose_id
     WHERE fm.parent_id = ?`,
    [parentId]
  );
  return rows;
}

async function inviteChild(parentId, childId) {
  // проверим, что пользователь существует и имеет роль child
  const [[u]] = await pool.query(`SELECT role FROM users WHERE id = ?`, [childId]);
  if (!u) {
    const e = new Error('Пользователь не найден');
    e.statusCode = 404;
    throw e;
  }
  if (u.role !== 'child') {
    const e = new Error('Можно приглашать только детей');
    e.statusCode = 400;
    throw e;
  }
  // вставляем связь
  await pool.query(
    `INSERT INTO family_members (parent_id, child_id) VALUES (?, ?)`,
    [parentId, childId]
  );
}

async function removeChild(parentId, childId) {
  const [res] = await pool.query(
    `DELETE FROM family_members WHERE parent_id = ? AND child_id = ?`,
    [parentId, childId]
  );
  if (res.affectedRows === 0) {
    const e = new Error('Связь не найдена');
    e.statusCode = 404;
    throw e;
  }
}

async function getChildInfo(parentId, childId) {
  const [[child]] = await pool.query(
    `SELECT u.id, u.name, u.avatar
       FROM family_members fm
       JOIN users u ON u.id = fm.child_id
      WHERE fm.parent_id = ? AND fm.child_id = ?`,
    [parentId, childId]
  );
  if (!child) {
    const e = new Error('Ребёнок не найден или не привязан');
    e.statusCode = 404;
    throw e;
  }
  return {
    id:     child.id,
    name:   child.name,
    avatar: child.avatar   // отдаём blob или URL, как храните
  };
}

async function getChildProgress(parentId, childId) {
  // проверим связь
  await getChildInfo(parentId, childId);

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
     WHERE j.user_id = ?
     ORDER BY j.date_started DESC`,
    [childId]
  );
  return rows;
}

module.exports = {
  listMembers,
  inviteChild,
  removeChild,
  getChildInfo,
  getChildProgress
};
