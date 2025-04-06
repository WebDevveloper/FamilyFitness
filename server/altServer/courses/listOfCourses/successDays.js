const db = require('./../../server/api'); // или другой способ подключения к БД
const jwt = require('jsonwebtoken'); // Импортируйте библиотеку для работы с JWT

const succesDays = async (req, res) => {
  try {
    const { courseId } = req.params;
    const token = req.headers.authorization.split(' ')[1]; // Извлекаем токен из заголовка
    const decoded = jwt.verify(token, 'fcea262ab199c23d3929ecae328ad1492179fd31bc2496413c98bcc3d26de024'); // Замените на ваш секретный ключ

    const userId = decoded.id; // Извлекаем id пользователя из токена

    
    const [rows] = await db.query(
      'SELECT current_day FROM journal WHERE purpose_id = ? AND user_id = ? LIMIT 1',
      [courseId, userId] // Добавляем user_id в запрос
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Запись в журнале не найдена.' });
    }

    // Возвращаем первую найденную запись
    return res.status(200).json({ journal: rows[0] });
  } catch (error) {
    console.error('Ошибка в succesDays:', error);
    return res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

module.exports = { succesDays };
