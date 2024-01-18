const db = require("../db/connection");

exports.findArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(*) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
      rows[0].comment_count = Number(rows[0].comment_count);
      return rows[0];
    });
};

exports.findArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p
) => {
  const validSortQueries = ["title", "author", "created_at", "votes"];
  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  const validOrderQueries = ["asc", "desc"];
  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryParameters = [];

  if (topic) {
    queryStr += ` WHERE articles.topic=$1`;
    queryParameters.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  if (p) {
    queryStr += ` LIMIT ${limit} OFFSET ${limit * (p - 1)}`;
  }

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

exports.insertArticle = ({ title, topic, author, body, article_img_url }) => {
  if (article_img_url === undefined) {
    article_img_url =
      "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";
  }
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *, (
        SELECT COUNT(*)
        FROM comments
        WHERE comments.article_id = articles.article_id
      ) AS comment_count`,
      [title, topic, author, body, article_img_url]
    )
    .then(({ rows }) => {
      rows[0].comment_count = Number(rows[0].comment_count);
      return rows[0];
    });
};

exports.removeArticleById = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id=$1`, [article_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
    });
};
