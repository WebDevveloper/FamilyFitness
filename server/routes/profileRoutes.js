// server/routes/profileRoutes.js
const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const permit       = require('../middleware/authorize');
const ctl          = require('../controllers/profileController');

router.use(authenticate);

router.get('/',    ctl.getProfile);
router.put('/',    permit('parent','child'), ctl.updateProfile);

module.exports = router;
