const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const ctl          = require('../controllers/familyController');

// Все эндпойнты доступны только аутентифицированному «parent»
router.use(authenticate, authorize('parent'));

/**
 * GET  /api/family
 *   — список приглашённых детей
 */
router.get('/', ctl.getChildren);

/**
 * POST /api/family/invite
 *   — пригласить ребёнка (body: { childId })
 */
router.post('/invite', ctl.inviteChild);

/**
 * DELETE /api/family/:childId
 *   — удалить ребёнка из семьи
 */
router.delete('/:childId', ctl.uninviteChild);

module.exports = router;
