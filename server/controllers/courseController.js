const courseService = require('../services/courseService');

// GET  /api/courses/list
async function listPurposes(req, res, next) {
  try {
    const list = await courseService.listPurposes();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

// GET  /api/courses/exercises/:purposeId
async function listExercises(req, res, next) {
  try {
    const { purposeId } = req.params;
    const exercises = await courseService.listExercisesByPurpose(purposeId);
    res.json({ exercises });
  } catch (err) {
    next(err);
  }
}

// POST /api/courses/start
async function startCourse(req, res, next) {
  try {
    const userId    = req.user.id;
    const { purposeId } = req.body;
    if (!purposeId) {
      const err = new Error('purposeId обязателен');
      err.statusCode = 400;
      throw err;
    }
    const record = await courseService.startCourse(userId, purposeId);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

// POST /api/courses/complete
async function completeDay(req, res, next) {
  try {
    const userId  = req.user.id;
    const { journalId } = req.body;
    if (!journalId) {
      const err = new Error('journalId обязателен');
      err.statusCode = 400;
      throw err;
    }
    await courseService.markDayComplete(userId, journalId);
    res.json({ message: 'День отмечен как выполненный' });
  } catch (err) {
    next(err);
  }
}

// GET  /api/courses/progress
async function getProgress(req, res, next) {
  try {
    const userId = req.user.id;
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
