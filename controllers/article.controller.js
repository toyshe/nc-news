const { findArticleById, findArticles } = require("../models/article.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  findArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  findArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};
