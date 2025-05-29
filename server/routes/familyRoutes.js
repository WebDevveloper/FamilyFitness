// server/routes/familyRoutes.js

const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const ctl          = require('../controllers/familyController');

// все эндпоинты — только для залогиненных “parent”
router.use(authenticate, authorize('parent'));

router.get(
  '/', 
  ctl.getChildren
);

router.post(
  '/invite',
  ctl.inviteChild
);

router.delete(
  '/:childId',
  ctl.uninviteChild
);

router.get(
  '/:childId/info',
  ctl.getChildInfo
);

router.get(
  '/:childId/progress',
  ctl.getChildProgress
);

module.exports = router;
