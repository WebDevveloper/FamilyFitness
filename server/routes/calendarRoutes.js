const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const ctl          = require('../controllers/calendarController');

router.use(authenticate);

/**
 * GET /api/calendar/events?month=YYYY-MM
 *   — все «события» (дни) для календаря
 */
router.get('/events', ctl.listEvents);

/**
 * POST /api/calendar/complete
 *  — отметить день в календаре как выполненный
 */
router.post('/complete', ctl.completeFromCalendar);

module.exports = router;
