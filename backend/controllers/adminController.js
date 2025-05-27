const Article = require('../models/Article');

exports.dashboard = (req, res) => {
  res.render('admin/dashboard');
};

exports.getArticles = async (req, res) => {
  const articles = await Article.find();
  res.render('admin/articles', { articles });
};

exports.createArticle = async (req, res) => {
  await Article.create(req.body);
  res.redirect('/admin/articles');
};

exports.updateArticle = async (req, res) => {
  await Article.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin/articles');
};

exports.deleteArticle = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/admin/articles');
};
