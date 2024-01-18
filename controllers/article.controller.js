const {
  findArticleById,
  findArticles,
  updateArticleById,
} = require("../models/article.model");
const { checkTopicExists } = require("../utils/check-exists");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  findArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  const fetchQuery = findArticles(topic);
  const queries = [fetchQuery];
  if (topic) {
    const topicExistenceQuery = checkTopicExists(topic);
    queries.push(topicExistenceQuery);
  }

  Promise.all(queries)
    .then(([fetchQuery]) => {
      res.status(200).send({ articles: fetchQuery });
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
