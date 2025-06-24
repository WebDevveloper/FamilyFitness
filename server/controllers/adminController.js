const adminService = require('../services/adminService');

async function getCourses(req, res, next) {
  try {
    const courses = await adminService.listCourses();
    res.json({ courses });
  } catch (err) { next(err) }
}

async function createCourse(req, res, next) {
  try {
    const { name, count_day, calories, description, image_url } = req.body;
    if (!name || typeof count_day !== 'number') {
      const e = new Error('name и count_day обязательны'); e.statusCode = 400; throw e;
    }
    const course = await adminService.createCourse({
      name, count_day, calories, description, image_url
    });
    res.status(201).json(course);
  } catch (err) { next(err) }
}

async function updateCourse(req, res, next) {
  try {
    const id = +req.params.id;
    const fields = req.body;
    const course = await adminService.updateCourse(id, fields);
    res.json(course);
  } catch (err) { next(err) }
}

async function deleteCourse(req, res, next) {
  try {
    const id = +req.params.id;
    await adminService.deleteCourse(id);
    res.json({ success: true });
  } catch (err) { next(err) }
}

async function publishCourse(req, res, next) {
  try {
    const id = +req.params.id;
    const { publish } = req.body;
    await adminService.togglePublishCourse(id, !!publish);
    res.json({ success: true });
  } catch (err) { next(err) }
}

async function getCourseExercises(req, res, next) {
  try {
    const purposeId = +req.params.id;
    if (isNaN(purposeId)) throw Object.assign(new Error('Неверный id курса'), { statusCode: 400 });
    const list = await adminService.listExercisesByCourse(purposeId);
    res.json({ exercises: list });
  } catch (err) { next(err) }
}

async function addExerciseToCourse(req, res, next) {
  try {
    const purposeId = +req.params.id;
    const { exerciseId, day } = req.body;
    if (isNaN(purposeId) || typeof exerciseId !== 'number' || typeof day !== 'number') {
      const e = new Error('Неправильные параметры'); e.statusCode = 400; throw e;
    }
    const cfg = await adminService.addExercise(purposeId, exerciseId, day);
    res.status(201).json(cfg);
  } catch (err) { next(err) }
}

async function removeExerciseFromCourse(req, res, next) {
  try {
    const configId = +req.params.configId;
    await adminService.removeExercise(configId);
    res.json({ success: true });
  } catch (err) { next(err) }
}

// --- Пользователи ---
async function listUsers(req, res, next) {
  try {
    const users = await adminService.listUsers();
    res.json({ users });
  } catch (err) { next(err) }
}

module.exports = {
  getCourses, createCourse, updateCourse, deleteCourse, publishCourse,
  getCourseExercises, addExerciseToCourse, removeExerciseFromCourse,
  listUsers
};
