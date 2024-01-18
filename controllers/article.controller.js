const {
  findArticleById,
  findArticles,
  updateArticleById,
  insertArticle,
} = require("../models/article.model");
const { checkTopicExists, checkPValid, checkLimitValid } = require("../utils/check-exists");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  findArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;

  const fetchQuery = findArticles(topic, sort_by, order, limit, p);
  const queries = [fetchQuery];
  if (topic) {
    const topicExistenceQuery = checkTopicExists(topic);
    queries.push(topicExistenceQuery);
  }

  if(p){
    const pageValidityQuery = checkPValid(p);
    queries.push(pageValidityQuery)
  }

  if(limit){
    const limitValidityQuery = checkLimitValid(limit);
    queries.push(limitValidityQuery)
  }

  Promise.all(queries)
    .then(([fetchQuery]) => {
      res
        .status(200)
        .send({ articles: fetchQuery, total_count: fetchQuery.length });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  updateArticleById(article_id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const body = req.body;

  insertArticle(body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
