const {findApi} = require('../models/api.model')

exports.getApi = (req, res, next) => {
    const data = findApi()
    res.status(200).send(data)
}

