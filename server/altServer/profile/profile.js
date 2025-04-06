// profile.js
const jwt = require('jsonwebtoken');
const db = require('./../server/api'); // Подключение к БД

/**
 * GET /api/profile
 * Возвращает данные профиля:
 *  - Информация о пользователе (id, name, avatarUrl, last_name_update)
 *  - Активные курсы с вычислением сожжённых калорий
 *  - Завершённые курсы (с полной калорийностью)
 */
const getProfile = async (req, res) => {
  try {
    // Извлекаем и проверяем токен
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный пользователь.' });
    }
    const decoded = jwt.verify(token,'fcea262ab199c23d3929ecae328ad1492179fd31bc2496413c98bcc3d26de024');
    const userId = decoded.id;
    
    // Получаем данные пользователя
    const [users] = await db.query(
      'SELECT id, name, avatar, last_name_update FROM users WHERE id = ?',
      [userId]
    );
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    const user = users[0];

    // Если аватар существует, преобразуем его в строку Base64
    if (user.avatar) {
      // Если поле уже является Buffer, используем его напрямую, иначе создаём Buffer из строки
      const avatarBuffer = Buffer.isBuffer(user.avatar)
        ? user.avatar
        : Buffer.from(user.avatar, 'binary');
      user.avatarUrl = `data:image/png;base64,${avatarBuffer.toString('base64')}`;
    } else {
      user.avatarUrl = ''; // Или URL к изображению по умолчанию
    }

  // return res.status(200).json({ user, activeCourses, completedCourses });
    
    // Активные курсы – добавляем current_day для расчёта сожжённых калорий
    const [activeCourses] = await db.query(
      `SELECT 
          j.purpose_id AS id, 
          p.name, 
          j.date_started AS dateStarted, 
          p.calories,
          j.current_day AS currentDay
       FROM journal j
       JOIN purpose p ON p.id = j.purpose_id
       WHERE j.user_id = ? AND j.is_over = 0`,
      [userId]
    );
    const activeCoursesComputed = activeCourses.map(course => {
      const completedDays = Math.max(0, course.currentDay - 1); // Если текущий день ещё не завершён, вычитаем 1
      const burnedCalories = (course.calories / 30) * completedDays;
      return { ...course, burnedCalories };
    });
    
    // Завершённые курсы – считаем, что сожжены все калории курса
    const [completedCourses] = await db.query(
      `SELECT 
          j.purpose_id AS id, 
          p.name, 
          j.date_started AS dateStarted, 
          j.end_date AS dateEnded, 
          p.calories
       FROM journal j
       JOIN purpose p ON p.id = j.purpose_id
       WHERE j.user_id = ? AND j.is_over = 1`,
      [userId]
    );
    const completedCoursesComputed = completedCourses.map(course => {
      return { ...course, burnedCalories: course.calories };
    });
    
    return res.status(200).json({
      user,
      activeCourses: activeCoursesComputed,
      completedCourses: completedCoursesComputed
    });
  } catch (error) {
    console.error('Ошибка в getProfile:', error);
    return res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

module.exports = { getProfile };
