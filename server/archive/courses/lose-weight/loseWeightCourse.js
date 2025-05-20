const jwt = require('jsonwebtoken');
const db = require('../../server/api'); // Подключение к базе данных
const dotenv = require('dotenv');
dotenv.config();

const loseWeigthCourse = async (req, res) => {
    try {
        // Извлечение токена из заголовка авторизации
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Неавторизованный пользователь' });
        }

        // Проверка токена и извлечение идентификатора пользователя
        const decoded = jwt.verify(token, dotenv.config.SECRET_KEY); // Используй свой секрет
        console.log('Decoded Token:', decoded);
        const userId = decoded.id;

        // Извлечение purposeId из тела запроса
        const { purposeId } = req.body;

        // Проверка существования курса в таблице purpose
        const [existingCourse] = await db.query('SELECT * FROM purpose WHERE id = ?', [purposeId]);
        if (existingCourse.length === 0) {
            return res.status(404).json({ message: 'Курс не найден.' });
        }

        // // Проверка, добавлен ли уже курс в журнал для данного пользователя
        // const [existingEntry] = await db.query(
        //     'SELECT * FROM journal WHERE user_id = ? AND purpose_id = ?',
        //     [userId, purposeId]
        // );
        // if (existingEntry.length > 0) {
        //     return res.status(400).json({ message: 'Этот курс уже выбран.' });
        // }

        // Выборка записей из purpose_config по purposeId
        const [purposeConfigs] = await db.query(
            'SELECT id FROM purpose WHERE id = ?',
            [purposeId]
        );

        // Проверка, что мы получили записи
        if (purposeConfigs.length === 0) {
            return res.status(404).json({ message: 'Нет доступных упражнений для этой цели.' });
        }

         // Текущая дата в формате YYYY-MM-DD
         const currentDate = new Date().toISOString().split('T')[0];

        // Добавление записей в журнал
        for (const config of purposeConfigs) {
            const [existingJournalEntry] = await db.query(
                'SELECT * FROM journal WHERE user_id = ? AND purpose_id = ?',
                [userId, config.id]
            );

            // Если записи нет, добавляем новую запись в журнал
            if (existingJournalEntry.length === 0) {
                await db.query(
                    'INSERT INTO journal (user_id, purpose_id, current_day, date_started) VALUES (?, ?, 1, ?)',
                    [userId, config.id, currentDate] // Здесь используем id из purpose_config
                );
            }
        }

        // Возвращаем успешный ответ
        return res.status(200).json({ message: 'Курс успешно выбран и добавлен в журнал.' });
    } catch (error) {
        console.error(error); // Логируем ошибку на сервере
        return res.status(500).json({ message: 'Ошибка сервера.' }); // Возвращаем сообщение об ошибке
    }
};

module.exports = { loseWeigthCourse };
