const db = require('../db/connection')

exports.findArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [id]).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({msg: 'Invalid id'})
        }
        return rows[0]
    })
}