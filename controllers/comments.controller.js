const { findArticleById } = require("../models/article.model");
const {
  findCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const checkArticleId = findArticleById(article_id);
  const fetchComments = findCommentsByArticleId(article_id);

  Promise.all([fetchComments, checkArticleId])
    .then(([fetchComments]) => {
      res.status(200).send({ comments: fetchComments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const data = req.body;

  const checkArticleId = findArticleById(article_id);
  const insertComments = insertCommentByArticleId(article_id, data);

  Promise.all([insertComments, checkArticleId])
    .then(([fetchComments]) => {
      res.status(201).send({ comments: fetchComments });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => res.sendStatus(204))
    .catch(next);
};
