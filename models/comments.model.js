const db = require("../db/connection");

exports.findCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
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
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
  .then((response) => {
    if(response.rowCount === 0){
      return Promise.reject({status: 404, msg: "comment_id not found"})
    }
  })
}
