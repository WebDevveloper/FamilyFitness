const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const permit       = require('../middleware/authorize');
const ctl          = require('../controllers/profileController');

router.use(authenticate);

// GET /api/profile/me — вернуть профиль текущего
router.get('/me', ctl.getProfile);

// PUT /api/profile — обновить профиль
router.put(
  '/',
  permit('parent', 'child', 'admin'),
  ctl.updateProfile
);

module.exports = router;