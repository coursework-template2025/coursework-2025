const Entry = require('../models/Entry');

exports.getEntries = async (req, res) => {
  const entries = await Entry.find({ user: req.user }).sort({ date: -1 });
  res.json(entries);
};

exports.createEntry = async (req, res) => {
  const { title, content, tags } = req.body;
  const entry = await Entry.create({ title, content, tags, user: req.user });
  res.status(201).json(entry);
};

exports.updateEntry = async (req, res) => {
  const entry = await Entry.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  if (!entry) return res.status(404).json({ message: 'Запись не найдена' });
  res.json(entry);
};

exports.deleteEntry = async (req, res) => {
  const deleted = await Entry.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!deleted) return res.status(404).json({ message: 'Запись не найдена' });
  res.json({ message: 'Запись удалена' });
};
