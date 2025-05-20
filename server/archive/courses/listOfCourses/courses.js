const jwt = require('jsonwebtoken');
const db = require('./../../server/api'); // Импортируй свой модуль для работы с БД
const dotenv = require('dotenv');
dotenv.config();

const courses = (req, res) => {
    // Middleware для проверки токена
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Токен отсутствует.' });
    }

    jwt.verify(token, dotenv.config.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Недействительный токен.' });
        }
        req.userId = decoded.id; // Сохраняем id пользователя в запросе
    });

    // Обработчик для получения курсов
    const userId = req.userId;

    db.query('SELECT p.id, p.name FROM purpose p LEFT JOIN journal j ON j.purpose_id=p.id WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка при получении курсов.', error: err });
        }
        res.json(results);
    });
};


module.exports = {courses};
