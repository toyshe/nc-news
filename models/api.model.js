const db = require('../db/connection')
const endpoints = require('../endpoints.json')

exports.findApi = () => {

    //make sure each endpoint in the file has a queries and a exampleResponse key
    for(const key in endpoints){
        if(!endpoints[key].hasOwnProperty('queries')){
            endpoints[key].queries = []
        }
        if(!endpoints[key].hasOwnProperty('exampleResponse')){
            endpoints[key].exampleResponse = {}
        }
    }
    return endpoints
}