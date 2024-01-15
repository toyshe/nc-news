const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("app", () => {
  describe("GET /api", () => {
    test("GET 200: returns an object containing all the endpoints available", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const endpointKeys = Object.keys(endpoints);
          expect(Object.keys(body).length).toBe(endpointKeys.length);

          endpointKeys.forEach((eachEndpointKey) => {
            const returnedData = body[eachEndpointKey];
            expect(returnedData).toHaveProperty("description");
            expect(returnedData).toHaveProperty("queries");
            expect(returnedData).toHaveProperty("exampleResponse");
          });
        });
    });
  });
  describe("GET /api/topics", () => {
    test("GET 200: returns all the topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
  describe("GET /api/aticles/:article_id", () => {
    test("GET 200: returns an article from article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("GET 404: returns Not Found if entered invalid article_id", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("GET 400: returns Bad Request if entered a non-existent article_id", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
