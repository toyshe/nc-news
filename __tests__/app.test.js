const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const testData = require('../db/data/test-data')
const endpoints = require('../endpoints.json')

afterAll(() => {
    return db.end();
})

beforeEach(() => {
    return seed(testData);
})

describe('app', () => {
    describe('GET /api', () => {
        test('GET 200: returns an object containing all the endpoints available', () => {
            return request(app).get('/api').expect(200).then(({body}) => {
                const endpointKeys = Object.keys(endpoints)
                expect(Object.keys(body).length).toBe(endpointKeys.length);

                endpointKeys.forEach((eachEndpointKey) => {
                    const returnedData = body[eachEndpointKey]
                    expect(returnedData).toHaveProperty('description')
                    expect(returnedData).toHaveProperty('queries')
                    expect(returnedData).toHaveProperty('exampleResponse')
                })
            })
        })
    })
    describe('GET /api/topics', () => {
        test('GET 200: returns all the topics', () => {
            return request(app).get('/api/topics').expect(200).then(({body}) => {
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug')
                    expect(topic).toHaveProperty('description')
                })
            })
        })
    })

})
