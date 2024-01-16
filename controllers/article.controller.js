const {
  findArticleById,
  findArticles,
  updateArticleById,
} = require("../models/article.model");

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

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  updateArticleById(article_id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

