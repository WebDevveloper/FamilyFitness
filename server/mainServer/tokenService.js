// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config(); // Подключаем .env файл

// const ACCESS_SECRET = 'fcea262ab199c23d3929ecae328ad1492179fd31bc2496413c98bcc3d26de024';
// const REFRESH_SECRET = '2a3374e5bfc9624dc4c645b5fca7f9c2ae240ec52d01ad25c43d2c1e7ddfbd37'

// const generateAccessToken = (payload) => {
//     const tokenPayload = { ...payload, secretVersion: process.env.SECRET_VERSION || 1 };
//     return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '10m' });
// };


// const generateRefreshToken = (payload) => {
//     return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
// };

// const verifyToken = (token) => {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (decoded.secretVersion !== Number(process.env.SECRET_VERSION)) {
//             throw new Error('Invalid secret version');
//         }
//         return decoded;
//     } catch (err) {
//         return null;
//     }
// };


// module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
