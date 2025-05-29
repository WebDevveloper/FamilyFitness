const adminService = require('../services/adminService');

async function getCourses(req, res, next) {
  try {
    const courses = await adminService.listCourses();
    res.json({ courses });
  } catch (err) { next(err); }
}

async function createCourse(req, res, next) {
  try {
    const { name, count_day, calories } = req.body;
    if (!name || typeof count_day !== 'number') {
      const e = new Error('name и count_day обязательны');
      e.statusCode = 400;
      throw e;
    }
    const course = await adminService.createCourse({ name, count_day, calories });
    res.status(201).json(course);
  } catch (err) { next(err); }
}

async function updateCourse(req, res, next) {
  try {
    const id = Number(req.params.id);
    const fields = req.body;
    const updated = await adminService.updateCourse(id, fields);
    res.json(updated);
  } catch (err) { next(err); }
}

async function deleteCourse(req, res, next) {
  try {
    const id = Number(req.params.id);
    await adminService.deleteCourse(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function getCourseExercises(req, res, next) {
  try {
    const purposeId = Number(req.params.id);
    const exercises = await adminService.listExercises(purposeId);
    res.json({ exercises });
  } catch (err) { next(err); }
}

async function addExerciseToCourse(req, res, next) {
  try {
    const purposeId  = Number(req.params.id);
    const { exerciseId, day } = req.body;
    if (typeof exerciseId !== 'number' || typeof day !== 'number') {
      const e = new Error('exerciseId и day обязательны и должны быть числами');
      e.statusCode = 400;
      throw e;
    }
    const cfg = await adminService.addExercise(purposeId, exerciseId, day);
    res.status(201).json(cfg);
  } catch (err) { next(err); }
}

async function removeExerciseFromCourse(req, res, next) {
  try {
    const configId = Number(req.params.configId);
    await adminService.removeExercise(configId);
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseExercises,
  addExerciseToCourse,
  removeExerciseFromCourse,
};