const express = require("express");

const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const { getArticleById, getArticles } = require("./controllers/article.controller");
const { getCommentsByArticleId } = require('./controllers/comments.controller')

const { errors404, psqlErrors, internalServerError } = require("./error-handling");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.use(errors404);

app.use(psqlErrors);

app.use(internalServerError)

module.exports = app;
