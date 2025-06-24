const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const ctl          = require('../controllers/adminController');

router.use(authenticate, authorize('admin'));

// Курсы
router.route('/courses')
  .get(ctl.getCourses)
  .post(ctl.createCourse);

router.route('/courses/:id')
  .put(ctl.updateCourse)
  .delete(ctl.deleteCourse);

router.put('/courses/:id/publish', ctl.publishCourse);

// Упражнения
router.route('/courses/:id/exercises')
  .get(ctl.getCourseExercises)
  .post(ctl.addExerciseToCourse);

router.delete(
  '/courses/:id/exercises/:configId',
  ctl.removeExerciseFromCourse
);

// Пользователи
router.get('/users', ctl.listUsers);

module.exports = router;
