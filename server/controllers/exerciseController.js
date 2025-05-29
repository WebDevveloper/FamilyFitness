const exerciseService = require('../services/exerciseService');

async function listExercises(req, res, next) {
  try {
    const exercises = await exerciseService.listAllExercises();
    res.json({ exercises });
  } catch (err) { next(err); }
}

module.exports = { listExercises };