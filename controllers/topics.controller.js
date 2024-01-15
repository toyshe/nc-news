const findTopics = require('../models/topics.models')

const getTopics = (req, res, next) => {
    findTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

module.exports = getTopics