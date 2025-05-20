// getExercises.js
const jwt = require('jsonwebtoken');
const db = require('../../app/api'); // Подключение к базе данных
const dotenv = require('dotenv');
dotenv.config();
/**
 * GET /api/exercises/:courseId/:day
 * Возвращает список упражнений для выбранного курса и дня.
 */
const getExercises = async (req, res) => {
  try {
    // Проверяем наличие и валидность токена
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный пользователь' });
    }
    const decoded = jwt.verify(token, dotenv.config.SECRET_KEY);
    // Можно использовать decoded.id, если понадобится фильтрация по пользователю

    const { courseId, day } = req.params;
    if (!courseId || !day) {
      return res.status(400).json({ message: 'Некорректные параметры запроса.' });
    }

    // Запрос к базе: выбираем упражнения из таблицы purpose_config, объединяя с таблицей exercise
    const query = `
      SELECT e.id, e.name, e.about, e.how_to_do, e.lose_weight, e.strength, e.cardio
      FROM purpose_config AS pc
      JOIN exercise AS e ON pc.exercise_id = e.id
      WHERE pc.purpose_id = ? AND pc.day = ?
    `;
    const [rows] = await db.query(query, [courseId, day]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Упражнения не найдены для выбранного дня.' });
    }

    return res.status(200).json({ exercises: rows });
  } catch (error) {
    console.error('Ошибка в getExercises:', error);
    return res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

module.exports = { getExercises };
