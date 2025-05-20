const profileService = require('../services/profileService');

async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const profile = await profileService.getProfile(userId);
    if (!profile) {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      throw err;
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const payload = req.body;
    const result  = await profileService.updateProfile(userId, payload);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile };