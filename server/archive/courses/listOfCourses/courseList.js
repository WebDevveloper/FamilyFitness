const jwt = require('jsonwebtoken');
const db = require('./../../server/api');

const courseList = async (req, res) => {
    try {
        console.log('Запрос пришёл с заголовками:', req.headers);
        // Проверка наличия заголовка Authorization
        const authHeader = req.headers.authorization;
        console.log("Заголовок: ", authHeader)
        if (!authHeader) {
            return res.status(401).json({ message: 'Токен отсутствует.' });
        }
        
        // Извлечение токена (ожидается формат "Bearer <токен>")
        const token = authHeader.split(' ')[1];
        console.log("Токен в файле курсов: ", token)

        if (!token) {
            return res.status(401).json({ message: 'Токен отсутствует.' });
        }
        
        // Верификация токена
        let decoded;
        try {
            const SECRET = 'fcea262ab199c23d3929ecae328ad1492179fd31bc2496413c98bcc3d26de024';
            decoded = jwt.verify(token, SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Недействительный токен.' });
        }
        
        // Проверка наличия идентификатора пользователя
        const userId = decoded.id; // Если в токене используется другое поле, например decoded.userId, измените это здесь.
        console.log("Id пользователя: ", userId)
        if (!userId) {
            return res.status(400).json({ message: 'Некорректные данные токена.' });
        }
        
        // Выполнение запроса к БД
        db.query(
            'SELECT p.id, p.name FROM purpose p LEFT JOIN journal j ON j.purpose_id=p.id WHERE user_id = ?',
            [userId],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Ошибка БД.' });
                res.json(results);
            }
        );
    } catch (error) {
        return res.status(500).json({ message: 'Ошибка сервера.' });
    }
};

module.exports = { courseList };
