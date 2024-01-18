const db = require('../db/connection')

exports.checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 400, msg: 'Invalid query'})
        }
    })
}