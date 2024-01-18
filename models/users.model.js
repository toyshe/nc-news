const db = require("../db/connection");

exports.findUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.findUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if(rows.length === 0){
        return Promise.reject({status: 400, msg: 'Invalid username'})
      }
      return rows[0];
    });
};
