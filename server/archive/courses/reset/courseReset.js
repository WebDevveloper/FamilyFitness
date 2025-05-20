// resetCourse.js
const jwt = require('jsonwebtoken');
const db = require('../../app/api'); // Путь к вашему модулю для работы с БД
const dotenv = require('dotenv');
dotenv.config();

const resetCourse = async (req, res) => {
  try {
    // Извлекаем токен и проверяем авторизацию
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный пользователь.' });
    }
    const decoded = jwt.verify(token, dotenv.config.SECRET_KEY);
    const userId = decoded.id;
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: 'Отсутствует идентификатор курса.' });
    }
    
    // Проверяем, есть ли активная запись для данного курса (is_over = 0)
    const [activeRecords] = await db.query(
      'SELECT * FROM journal WHERE user_id = ? AND purpose_id = ? AND is_over = 0 LIMIT 1',
      [userId, courseId]
    );
    const currentDate = new Date().toISOString().split('T')[0];
    if (activeRecords.length > 0) {
      const activeRecord = activeRecords[0];
      // Если запись не завершена (is_over == false) и текущий день меньше или равен 30, сброс невозможен
      if (!activeRecord.is_over && parseInt(activeRecord.current_day, 10) <= 30) {
        return res.status(400).json({ message: 'Курс еще не завершен. Сброс невозможен.' });
      }
      // Если запись не завершена, но current_day > 30, завершаем ее
      if (!activeRecord.is_over) {
        await db.query(
          'UPDATE journal SET is_over = 1, end_data = ? WHERE id = ?',
          [currentDate, activeRecord.id]
        );
      }
    }
    
    // Вставляем новую запись для повторного прохождения курса
    await db.query(
      'INSERT INTO journal (user_id, purpose_id, current_day, date_started, is_over) VALUES (?, ?, 1, ?, 0)',
      [userId, courseId, currentDate]
    );
    
    return res.status(200).json({ message: 'Курс сброшен и начат заново.' });
  } catch (error) {
    console.error('Ошибка в resetCourse:', error);
    return res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

module.exports = { resetCourse };
