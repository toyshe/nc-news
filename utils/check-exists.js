const db = require("../db/connection");

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid query" });
      }
    });
};

exports.checkPValid = (p) => {
  if (isNaN(Number(p)) || p < 0) {
    return Promise.reject({ status: 400, msg: "Invalid page query" });
  }
};

exports.checkLimitValid = (limit) => {
    if(isNaN(Number(limit)) || limit< 0){
        return Promise.reject({status: 400, msg: 'Invalid limit query'})
    }
}
