// completeDay.js
const jwt = require('jsonwebtoken');
const db = require('../../app/api'); // Подключение к базе данных
const dotenv = require('dotenv');
dotenv.config();
/**
 * POST /api/journal/:courseId/:day/complete
 * Обновляет прогресс пользователя: если текущий день не последний, то увеличивает current_day; 
 * если последний – помечает курс как завершён и записывает дату окончания.
 */
const completeDay = async (req, res) => {
  try {
    // Проверяем наличие и валидность токена
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный пользователь' });
    }
    const decoded = jwt.verify(token, dotenv.config.SECRET_KEY);
    const userId = decoded.id;

    const { courseId, day } = req.params;
    if (!courseId || !day) {
      return res.status(400).json({ message: 'Некорректные параметры запроса.' });
    }

    // Получаем данные курса из таблицы purpose, чтобы знать общее количество дней
    const [courseRows] = await db.query('SELECT count_day FROM purpose WHERE id = ?', [courseId]);
    if (courseRows.length === 0) {
      return res.status(404).json({ message: 'Курс не найден.' });
    }
    const totalDays = courseRows[0].count_day;

    // Получаем запись из журнала для данного пользователя и курса
    const [journalRows] = await db.query(
      'SELECT * FROM journal WHERE user_id = ? AND purpose_id = ? AND is_over = ? ORDER BY date_started DESC LIMIT 1',
      [userId, courseId, 0]
    );

    if (journalRows.length === 0) {
      return res.status(404).json({ message: 'Запись в журнале не найдена. Возможно, курс не выбран.' });
    }

    // Берем первую запись (если в будущем будет несколько, логику можно расширить)
    const journalEntry = journalRows[0];

    // Проверяем, соответствует ли текущий день тому, который пришёл в запросе
    if (parseInt(journalEntry.current_day, 10) !== parseInt(day, 10)) {
      return res.status(400).json({ message: 'Неверный день для завершения.' });
    }

    const currentDate = new Date().toISOString().split('T')[0];

    // Если текущий день меньше общего количества дней, увеличиваем current_day
    if (parseInt(day, 10) < totalDays) {
      await db.query(
        'UPDATE journal SET current_day = ? WHERE id = ?',
        [parseInt(day, 10) + 1, journalEntry.id]
      );
      return res.status(200).json({ message: 'День успешно завершён.' });
    } else {
      // Если это последний день, отмечаем курс как завершён
      await db.query(
        'UPDATE journal SET is_over = ?, end_data = ? WHERE id = ?',
        [1, currentDate, journalEntry.id]
      );
      return res.status(200).json({ message: 'Поздравляем! Вы завершили курс.' });
    }
  } catch (error) {
    console.error('Ошибка в completeDay:', error);
    return res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

module.exports = { completeDay };
