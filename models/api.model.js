const db = require('../db/connection')
const endpoints = require('../endpoints.json')

exports.findApi = () => {
    return endpoints
}