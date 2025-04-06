const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config({ path: './config/.env' }); // Подключаем .env файл
// Секретные ключи
const ACCESS_SECRET = 'fcea262ab199c23d3929ecae328ad1492179fd31bc2496413c98bcc3d26de024';
const REFRESH_SECRET = '2a3374e5bfc9624dc4c645b5fca7f9c2ae240ec52d01ad25c43d2c1e7ddfbd37';

// Генерация Access токена
const generateAccessToken = (user) => {
    const payload = {
        id: user.id,      // Включаем id пользователя
        name: user.name   // Если нужно, добавляем имя
    };
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1d' });
};

// Генерация Refresh токена
const generateRefreshToken = (user) => {
    const payload = {
        id: user.id,      // Включаем id пользователя
        name: user.name   // Если нужно, добавляем имя
    };
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    ACCESS_SECRET,
};
