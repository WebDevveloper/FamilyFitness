const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const permit       = require('../middleware/authorize');
const authorize    = require('../middleware/authorize');
const ctl          = require('../controllers/courseController');

// все операции с курсами — только для авторизованных пользователей
router.use(authenticate);

/**
 * GET  /api/courses/list
 *   — список программ
 */
router.get('/list', ctl.listPurposes);

/**
 * GET  /api/courses/exercises/:purposeId
 *   — упражнения по программе
 */
router.get('/exercises/:purposeId', ctl.listExercises);

// POST /api/courses/start
// — начинает курс пользователя: создаёт запись в journal и возвращает её
router.post(
  '/start',
  permit('parent','child'),
  ctl.startCourse      // ← нужно дописать в контроллер
);

// POST /api/courses/reset
// перезапуск курса.
router.post ('/reset',
  permit('parent','child'), 
  ctl.resetCourse);

/**
 * POST /api/courses/complete
 *   — отметить день выполненным
 */
router.post(
  '/complete',
  authorize('parent', 'child'),
  ctl.completeDay
);

/**
 * GET  /api/courses/progress
 *   — прогресс пользователя
 */
router.get(
  '/progress',
  authorize('parent', 'child'),
  ctl.getProgress
);

module.exports = router;