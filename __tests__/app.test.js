const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const testData = require('../db/data/test-data')

afterAll(() => {
    return db.end();
})

beforeEach(() => {
    return seed(testData);
})

describe('app', () => {
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
