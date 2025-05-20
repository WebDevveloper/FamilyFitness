const familyService = require('../services/familyService');

async function getChildren(req, res, next) {
  try {
    const parentId = req.user.id;      // берём из middleware authenticate
    const members  = await familyService.listMembers(parentId);
    res.json(members);
  } catch (err) {
    next(err);
  }
}

async function inviteChild(req, res, next) {
  try {
    const parentId = req.user.id;
    const { childId } = req.body;
    if (!childId) {
      const err = new Error('childId обязателен');
      err.statusCode = 400;
      throw err;
    }
    await familyService.inviteChild(parentId, childId);
    res.status(201).json({ message: 'Приглашение отправлено' });
  } catch (err) {
    next(err);
  }
}

async function uninviteChild(req, res, next) {
  try {
    const parentId = req.user.id;
    const { childId } = req.params;
    await familyService.removeChild(parentId, childId);
    res.json({ message: 'Ребёнок удалён из семьи' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getChildren,
  inviteChild,
  uninviteChild
};
