const journalService = require('../services/journalService');

async function getJournal(req, res, next) {
  try {
    const userId    = req.user.id;
    const { purposeId } = req.params;
    const journal = await journalService.getJournal(userId, purposeId);
    if (!journal) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }
    res.json(journal);
  } catch (err) {
    next(err);
  }
}

async function completeDay(req, res, next) {
  try {
    const userId    = req.user.id;
    const { purposeId, day } = req.params;
    await journalService.markDayComplete(userId, purposeId, day);
    res.json({ message: 'День отмечен выполненным' });
  } catch (err) {
    next(err);
  }
}

async function resetJournal(req, res, next) {
  try {
    const userId    = req.user.id;
    const { purposeId } = req.params;
    await journalService.resetJournal(userId, purposeId);
    res.json({ message: 'Курс сброшен' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getJournal, completeDay, resetJournal };