const courseService = require('../services/courseService');

/** GET  /api/courses/list */
async function listPurposes(req, res, next) {
  try {
    const list = await courseService.listPurposes();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

/** GET  /api/courses/exercises/:purposeId */
async function listExercises(req, res, next) {
  try {
    // 1) Явно разбираем параметр из URL
    const purposeId = parseInt(req.params.purposeId, 10);
    if (isNaN(purposeId)) {
      const err = new Error('Неправильный параметр purposeId');
      err.statusCode = 400;
      throw err;
    }

    // 2) Передаём чистое число в сервис
    const exercises = await courseService.listExercisesByPurpose(purposeId);
    res.json({ exercises });
  } catch (err) {
    next(err);
  }
}

/** POST /api/courses/start */
async function startCourse(req, res, next) {
  try {
    const userId     = req.user.id;
    const { purposeId } = req.body;
    if (!purposeId) {
      const e = new Error('purposeId обязателен');
      e.statusCode = 400;
      throw e;
    }
    const record = await courseService.startCourse(userId, purposeId);
    // Если новая попытка создана — 201, иначе 200
    const status = record.currentDay === 1 ? 201 : 200;
    res.status(status).json(record);
  } catch (err) {
    next(err);
  }
}

/** POST /api/courses/complete */
async function completeDay(req, res, next) {
  try {
    const userId    = req.user.id;
    const { journalId } = req.body;
    if (!journalId) {
      const e = new Error('journalId обязателен');
      e.statusCode = 400;
      throw e;
    }
    await courseService.markDayComplete(userId, journalId);
    res.json({ message: 'День отмечен как выполненный' });
  } catch (err) {
    next(err);
  }
}

/** GET  /api/courses/progress */
async function getProgress(req, res, next) {
  try {
    const userId   = req.user.id;
    const progress = await courseService.getProgress(userId);
    res.json({ progress });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPurposes,
  listExercises,
  startCourse,
  completeDay,
  getProgress
};
