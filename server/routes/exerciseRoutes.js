const router = require('express').Router();
const ctl    = require('../controllers/exerciseController');

// открытый список всех упражнений
router.get('/', ctl.listExercises);

module.exports = router;