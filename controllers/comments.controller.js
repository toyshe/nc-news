const { findArticleById } = require("../models/article.model");
const { findCommentsByArticleId } = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const checkArticleId = findArticleById(article_id);
  const fetchComments = findCommentsByArticleId(article_id);

  Promise.all([fetchComments, checkArticleId])
    .then((response) => {
      const comments = response[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
