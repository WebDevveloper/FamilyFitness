// server/token/tokenService.js
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '60m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
}

async function generateTokens(user) {
  const access  = generateAccessToken(user);
  const refresh = generateRefreshToken(user);
  // Здесь можно сохранить refresh-токен в БД для ротации/инвалидации
  return { access, refresh };
}

module.exports = { generateTokens };