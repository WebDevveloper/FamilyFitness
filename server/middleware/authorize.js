module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    // Если нет роли в токене — 401
    if (!req.user?.role) {
      return res.status(401).json({ message: 'Неавторизован' });
    }
    // admin всегда имеет доступ
    if (req.user.role === 'admin') {
      return next();
    }
    // или проверяем, есть ли среди разрешённых
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: 'Доступ запрещён' });
  };
};
