const db = require('../db/connection')

const findTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows}) => {
        return rows;
    })
}

module.exports = findTopics