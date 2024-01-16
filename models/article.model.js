const db = require("../db/connection");

exports.findArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Invalid id" });
      }
      return rows[0];
    });
};

exports.findArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
        return rows
    });
};
