const { findTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  findTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const body = req.body;
  insertTopic(body).then((topic) => {
    res.status(201).send({ topic });
  }).catch(next);
};
