const articlesRouters = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/article.controller");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller");


articlesRouters.get("/", getArticles);

articlesRouters
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouters
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouters;
