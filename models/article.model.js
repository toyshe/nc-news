const db = require("../db/connection");

exports.findArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
      return rows[0];
    });
};

exports.findArticles = (topic) => {
  const validTopics = ["mitch", "cats", "paper"];

  queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  const queryParameters = [];
  if (topic) {
    queryStr += ` WHERE articles.topic=$1`;
    queryParameters.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC`;

  return db.query(queryStr, queryParameters).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleById = (id, body) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
      rows[0].votes += Number(body.inc_votes);
      if (isNaN(rows[0].votes)) {
        return Promise.reject({ status: 400, msg: "Invalid vote" });
      } else if (rows[0].votes < 0) {
        rows[0].votes = 0;
      }
      return rows[0];
    });
};
