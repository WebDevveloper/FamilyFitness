// profileEdit.js
const jwt = require('jsonwebtoken');
const db = require('./../server/api');

const editProfile = async (req, res) => {
  try {
    // Извлекаем токен
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный пользователь.' });
    }
    // ВАЖНО: убедитесь, что секрет совпадает
    const decoded = jwt.verify(token, 'fcea262ab199c23d3929ecae328ad1492179fd31bc2496413c98bcc3d26de024');
    const userId = decoded.id;
    
    const { name, avatar } = req.body; // Новые значения профиля
    
    // Получаем текущие данные пользователя
    const [users] = await db.query('SELECT name, last_name_update, avatar FROM users WHERE id = ?', [userId]);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    const user = users[0];
    
    // Если изменяется имя, проверяем, прошло ли 30 дней с последнего обновления
    if (name && name !== user.name) {
      const lastUpdate = user.last_name_update;
      if (lastUpdate) {
        const lastUpdateDate = new Date(lastUpdate);
        const now = new Date();
        const diffTime = now - lastUpdateDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays < 30) {
          return res.status(400).json({ message: 'Имя можно менять не чаще, чем раз в 30 дней.' });
        }
      }
    }
    
    // Если аватар передан, преобразуем его в Buffer
    let avatarBuffer = null;
    if (avatar) {
      // Если avatar является data URI, удаляем префикс и конвертируем в Buffer
      if (avatar.startsWith('data:')) {
        const base64Data = avatar.split(',')[1];
        avatarBuffer = Buffer.from(base64Data, 'base64');
      } else {
        // Если аватар передан как обычная строка (например, URL), можно оставить её как есть или обработать отдельно
        avatarBuffer = avatar;
      }
    }
    
    // Если имя изменилось – обновляем поле last_name_update, иначе оставляем прежнее
    const newLastUpdate = name && name !== user.name ? new Date() : user.last_name_update;
    
    await db.query(
      'UPDATE users SET name = ?, avatar = ?, last_name_update = ? WHERE id = ?',
      [name || user.name, avatarBuffer || user.avatar, newLastUpdate, userId]
    );
    
    return res.status(200).json({ message: 'Профиль обновлен успешно.' });
  } catch (error) {
    console.error('Ошибка в editProfile:', error);
    return res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

module.exports = { editProfile };
