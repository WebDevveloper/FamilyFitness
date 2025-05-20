// server/routes/index.js
const router = require('express').Router();

router.use('/auth',    require('./authRoutes'));
router.use('/family',  require('./familyRoutes'));
router.use('/courses', require('./courseRoutes'));
router.use('/journal', require('./journalRoutes'));
router.use('/profile', require('./profileRoutes'));

module.exports = router;