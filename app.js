const express = require("express");

const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const { getArticleById, getArticles } = require("./controllers/article.controller");
const { getCommentsByArticleId, postCommentByArticleId } = require('./controllers/comments.controller')

const { errors404, psqlErrors, internalServerError } = require("./error-handling");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.use(errors404);

app.use(psqlErrors);

app.use(internalServerError)

module.exports = app;
