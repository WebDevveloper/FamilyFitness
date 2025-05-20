const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const permit       = require('../middleware/authorize');
const ctl          = require('../controllers/journalController');

// Все операции только для аутентифицированных «parent» или «child»
router.use(authenticate, permit('parent','child'));

/**
 * GET  /api/journal/:purposeId
 *   — получить прогресс по курсу (сюда попадают и текущий день, и is_over, и т.д.)
 */
router.get('/:purposeId', ctl.getJournal);

/**
 * POST /api/journal/:purposeId/:day/complete
 *   — отметить указанный день выполненным
 */
router.post('/:purposeId/:day/complete', ctl.completeDay);

/**
 * POST /api/journal/:purposeId/reset
 *   — сбросить курс (current_day → 1, is_over → 0)
 */
router.post('/:purposeId/reset', ctl.resetJournal);

module.exports = router;