// const bcrypt = require('bcrypt');
// const db = require('./api');
// const tokenService = require('./tokenService');

// // Регистрация пользователя
// const registration = async (req, res) => {
//     const { name, password } = req.body;

//     if (!name || !password) {
//         return res.status(400).json({ error: 'Имя и пароль обязательны.' });
//     }

//     try {
//         const hashedPassword = await bcrypt.hash(password, 12);
//         const query = 'INSERT INTO users (name, password, is_admin) VALUES (?, ?, ?)';
//         db.query(query, [name, hashedPassword, 0], (err, result) => {
//             if (err) {
//                 console.error('Ошибка при добавлении пользователя:', err.message);
//                 return res.status(500).json({ error: 'Ошибка сервера.' });
//             }
//             if (err && err.code === 'ER_DUP_ENTRY') {
//                 return res.status(409).json({ error: 'Пользователь с таким именем уже существует.' });
//             }

//             const accessToken = tokenService.generateAccessToken({ id: result.insertId, name });
//             const refreshToken = tokenService.generateRefreshToken({ id: result.insertId });

//             res.status(201).json({
//                 message: 'Пользователь успешно зарегистрирован.',
//                 accessToken,
//                 refreshToken,
//             });
//         });
//     } catch (err) {
//         res.status(500).json({ error: 'Ошибка хеширования пароля.' });
//     }
// };

// // Авторизация пользователя
// const login = async (req, res) => {
//     const { name, password } = req.body;

//     if (!name || !password) {
//         return res.status(400).json({ error: 'Имя и пароль обязательны.' });
//     }

//     try {
//         const query = 'SELECT * FROM users WHERE name = ?';
//         db.query(query, [name], async (err, results) => {
//             if (err || results.length === 0) {
//                 return res.status(400).json({ error: 'Неверное имя пользователя или пароль.' });
//             }

//             const user = results[0];
//             const isValidPassword = await bcrypt.compare(password, user.password);
//             if (!isValidPassword) {
//                 return res.status(401).json({ error: 'Неверный пароль.' });
//             }

//             const accessToken = tokenService.generateAccessToken({ id: user.id, name: user.name });
//             const refreshToken = tokenService.generateRefreshToken({ id: user.id });

//             res.json({ accessToken, refreshToken });
//         });
//     } catch (err) {
//         res.status(500).json({ error: 'Ошибка сервера.' });
//     }
// };

// // Получение списка пользователей
// const getUsers = (req, res) => {
//     const query = 'SELECT id, name, is_admin FROM users';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Ошибка получения списка пользователей:', err.message);
//             return res.status(500).json({ error: 'Ошибка сервера.' });
//         }
//         res.json(results);
//     });
// };

// module.exports = { registration, login, getUsers };