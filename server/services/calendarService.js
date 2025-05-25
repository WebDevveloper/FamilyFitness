const { pool } = require('../config/db');
const courseService = require('./courseService');

/**
 * Собираем все отмеченные дни пользователя за месяц
 * Возвращаем [{ date, purposeId, journalId, day }, ...]
 */
async function getEventsForMonth(userId, month) {
  // Достать из journal записи за месяц, где end_date или date_started попадает в месяц
  // И разбить на отдельные дни (current_day позволяет понять последний пройденный)
  const [rows] = await pool.query(
    `SELECT j.id AS journalId,
            j.purpose_id AS purposeId,
            p.count_day,
            j.date_started,
            j.end_date
       FROM journal j
       JOIN purpose p ON p.id=j.purpose_id
      WHERE j.user_id=?
        AND (
          DATE_FORMAT(j.date_started, '%Y-%m') = ?
          OR DATE_FORMAT(j.end_date,   '%Y-%m') = ?
        )`,
    [userId, month, month]
  );

  const events = [];

  for (const rec of rows) {
    // 1) все дни от date_started до min(end_date||today, date_started+count_day-1)
    const start = new Date(rec.date_started);
    const end   = rec.end_date ? new Date(rec.end_date) : new Date();
    // ограничим не далее, чем количество дней
    const maxDayDate = new Date(start);
    maxDayDate.setDate(start.getDate() + rec.count_day - 1);
    if (end > maxDayDate) end.setTime(maxDayDate.getTime());

    // вычисляем offset дней
    let curr = new Date(start);
    let dayIndex = 1;
    while (curr <= end) {
      // только если попадает в запрошенный месяц
      if (curr.toISOString().slice(0,7) === month) {
        events.push({
          date: curr.toISOString().slice(0,10),
          purposeId: rec.purposeId,
          journalId: rec.journalId,
          day: dayIndex
        });
      }
      curr.setDate(curr.getDate() + 1);
      dayIndex++;
    }
  }

  return events;
}

/**
 * Отметить из календаря: делегирует в courseService.markDayComplete
 */
async function completeDayFromCalendar(userId, journalId, day) {
  // Проверим, что это действительно следующий текущий день
  // Получим прогресс
  const progress = await courseService.getProgress(userId);
  const rec = progress.find(r => r.journalId === journalId);
  if (!rec) {
    const e = new Error('Попытка не найдена');
    e.statusCode = 404;
    throw e;
  }
  if (rec.isOver) {
    const e = new Error('Курс уже завершён');
    e.statusCode = 400;
    throw e;
  }
  if (day !== rec.currentDay) {
    const e = new Error(`Можно отмечать только текущий день (${rec.currentDay})`);
    e.statusCode = 400;
    throw e;
  }
  // Проводим отметку
  const result = await courseService.markDayComplete(userId, journalId);
  return result;
}

module.exports = {
  getEventsForMonth,
  completeDayFromCalendar
};
