const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const ctl          = require('../controllers/adminController');

// все админ-роуты — только для роли 'admin'
router.use(authenticate, authorize('admin'));

// CRUD для курсов
router
  .route('/courses')
  .get(ctl.getCourses)
  .post(ctl.createCourse);

router
  .route('/courses/:id')
  .put(ctl.updateCourse)
  .delete(ctl.deleteCourse);

// Управление упражнениями в курсе
router
  .route('/courses/:id/exercises')
  .get(ctl.getCourseExercises)
  .post(ctl.addExerciseToCourse);

router.delete(
  '/courses/:id/exercises/:configId',
  ctl.removeExerciseFromCourse
);

module.exports = router;