// const express = require('express');
// const { registration, login, getUsers } = require('./authController');

// const router = express.Router();

// // Маршруты аутентификации
// router.post('/registration', registration);
// router.post('/login', login);
// router.get('/users', getUsers);

// router.use((req, res, next) => {
//     console.log(`Запрос на маршрут: ${req.originalUrl}`);
//     next();
// });

// router.use((req, res, next) => {
//     res.status(404).json({ error: 'Маршрут не найден' });
// });

// module.exports = router;