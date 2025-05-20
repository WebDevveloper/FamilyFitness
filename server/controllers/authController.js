const jwt        = require('jsonwebtoken');
const userService = require('../services/userService');

const SECRET       = process.env.JWT_ACCESS_SECRET;
const REFRESH_SEC  = process.env.JWT_REFRESH_SECRET;

async function register(req, res, next) {
  try {
    const { name, password, role } = req.body;
    if (!name || !password) {
      const err = new Error('Имя и пароль обязательны.');
      err.statusCode = 400;
      throw err;
    }
    const existing = await userService.findUserByName(name);
    if (existing) {
      const err = new Error('Пользователь с таким именем уже существует.');
      err.statusCode = 409;
      throw err;
    }
    const user = await userService.createUser({ name, password, role });
    res.status(201).json({ id: user.id, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      const err = new Error('Имя и пароль обязательны.');
      err.statusCode = 400;
      throw err;
    }
    const user = await userService.findUserByName(name);
    if (!user) {
      const err = new Error('Неверные имя или пароль.');
      err.statusCode = 401;
      throw err;
    }
    const match = await require('bcrypt').compare(password, user.password);
    if (!match) {
      const err = new Error('Неверные имя или пароль.');
      err.statusCode = 401;
      throw err;
    }
    const payload = { id: user.id, name: user.name, role: user.role };
    const accessToken  = jwt.sign(payload, SECRET,      { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_SEC, { expiresIn: '7d' });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };