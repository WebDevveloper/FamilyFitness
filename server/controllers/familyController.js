// server/controllers/familyController.js

const familyService = require('../services/familyService');

async function getChildren(req, res, next) {
  try {
    const parentId = req.user.id;
    const members  = await familyService.listMembers(parentId);
    // возвращаем массив прямо — клиент делает `setMembers(data)`
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
      const e = new Error('childId обязателен');
      e.statusCode = 400;
      throw e;
    }
    await familyService.inviteChild(parentId, childId);
    res.status(201).json({ message: 'Ребёнок приглашён' });
  } catch (err) {
    // дубль — читаемое 400
    if (err.code === 'ER_DUP_ENTRY') {
      err = Object.assign(new Error('Этот ребёнок уже приглашён'), { statusCode: 400 });
    }
    next(err);
  }
}

async function uninviteChild(req, res, next) {
  try {
    const parentId = req.user.id;
    const childId  = Number(req.params.childId);
    await familyService.removeChild(parentId, childId);
    res.json({ message: 'Ребёнок удалён' });
  } catch (err) {
    next(err);
  }
}

async function getChildInfo(req, res, next) {
  try {
    const parentId = req.user.id;
    const childId  = Number(req.params.childId);
    const info = await familyService.getChildInfo(parentId, childId);
    res.json(info);
  } catch (err) {
    next(err);
  }
}

async function getChildProgress(req, res, next) {
  try {
    const parentId = req.user.id;
    const childId  = Number(req.params.childId);
    const progress = await familyService.getChildProgress(parentId, childId);
    res.json({ progress });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getChildren,
  inviteChild,
  uninviteChild,
  getChildInfo,
  getChildProgress
};
