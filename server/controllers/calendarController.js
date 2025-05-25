const calendarService = require('../services/calendarService');

/**
 * GET /api/calendar/events?month=YYYY-MM
 */
async function listEvents(req, res, next) {
  try {
    const userId = req.user.id;
    const month  = req.query.month;              // формат YYYY-MM
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      const e = new Error('Параметр month обязателен и должен быть в формате YYYY-MM');
      e.statusCode = 400;
      throw e;
    }
    const events = await calendarService.getEventsForMonth(userId, month);
    res.json(events);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/calendar/complete
 */
async function completeFromCalendar(req, res, next) {
  try {
    const userId    = req.user.id;
    const { journalId, day } = req.body;
    if (!journalId || typeof day !== 'number') {
      const e = new Error('journalId и day обязательны');
      e.statusCode = 400;
      throw e;
    }
    // отмечаем день через сервис календаря
    const result = await calendarService.completeDayFromCalendar(userId, journalId, day);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listEvents,
  completeFromCalendar
};
