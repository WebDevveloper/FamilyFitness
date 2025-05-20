const db = require('../app/api');
// const crypto = require('crypto');
const bcrypt = require('bcrypt');
const tokenService = require('../../token/tokenService');

// Регистрация пользователя
const registration = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: 'Имя и пароль обязательны.' });
    }

    try {
        // Хеширование пароля
        // const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Добавление пользователя в базу данных
        const query = 'INSERT INTO users (name, password, is_admin) VALUES (?, ?, ?)';
        await db.query(query, [name, hashedPassword, 0]);

        // Генерация токенов
        // const accessToken = tokenService.generateAccessToken({ name });
        // const refreshToken = tokenService.generateRefreshToken({ name });

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован.'});
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Пользователь с таким именем уже существует.' });
        }
        console.error('Ошибка при регистрации:', err.message);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
};

// Авторизация пользователя
const login = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: 'Имя и пароль обязательны.' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Неверное имя пользователя или пароль.' });
        }

        const user = users[0];
        // const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (user.password !== isValidPassword) {
            return res.status(401).json({ error: 'Неверный пароль.' });
        }

        // Генерация токенов
        const accessToken = tokenService.generateAccessToken({ name: user.name, id: user.id });
        console.log("Ацесс токен создан", accessToken)  
        const refreshToken = tokenService.generateRefreshToken({ name: user.name, id: user.id });

        // Отправляем токены клиенту
        res.json({ accessToken, refreshToken });
        console.log('Токены отправлены клиенту')
    } catch (err) {
        console.error('Ошибка авторизации:', err.message);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
};

// Получение списка пользователей
const getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, is_admin FROM users');
        res.json(users);
    } catch (err) {
        console.error('Ошибка получения пользователей:', err.message);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
};

module.exports = { registration, login, getUsers };
