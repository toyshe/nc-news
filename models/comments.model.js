const db = require("../db/connection");

exports.findCommentsByArticleId = (article_id, limit = 10, p) => {
  let queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;

  const queryParameters = [article_id];

  if (p) {
    queryStr += ` LIMIT ${limit} OFFSET ${limit * (p - 1)}`;
  }

  return db.query(queryStr, queryParameters).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentByArticleId = (article_id, data) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [data.body, data.username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      }
    });
};

exports.updateCommentById = (comment_id, body) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id=$1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      }
      rows[0].votes += body.inc_votes;
      if (isNaN(rows[0].votes)) {
        return Promise.reject({ status: 400, msg: "Invalid vote" });
      } else if (rows[0].votes < 0) {
        rows[0].votes = 0;
      }
      return rows[0];
    });
};
