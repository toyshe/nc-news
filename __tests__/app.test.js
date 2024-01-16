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
  describe("/api", () => {
    test("GET 200: returns an object containing all the endpoints available", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const endpointKeys = Object.keys(endpoints);
          expect(Object.keys(body).length).toBe(endpointKeys.length);

          endpointKeys.forEach((eachEndpointKey) => {
            expect(body[eachEndpointKey]).toEqual(endpoints[eachEndpointKey]);
          });
        });
    });
  });
  describe("/api/topics", () => {
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
    test("GET 404: expect a 404 status code if an invalid route is given", () => {
      return request(app).get("/api/not-valid-route").expect(404);
    });
  });
  describe("/api/articles/:article_id", () => {
    test("GET 200: returns an article from article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(1);
          expect(body.article.title).toBe(
            "Living in the shadow of a great man"
          );
          expect(body.article.topic).toBe("mitch");
          expect(body.article.author).toBe("butter_bridge");
          expect(body.article.body).toBe("I find this existence challenging");
          expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(body.article.votes).toBe(100);
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("GET 404: returns Not Found if entered invalid article_id", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article_id not found");
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
    test("PATCH 200: updates the votes of an article by article_id and returns the updated article", () => {
      const updatedContent = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedContent)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(1);
          expect(body.article.title).toBe(
            "Living in the shadow of a great man"
          );
          expect(body.article.topic).toBe("mitch");
          expect(body.article.author).toBe("butter_bridge");
          expect(body.article.body).toBe("I find this existence challenging");
          expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(body.article.votes).toBe(101);
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("PATCH 400: return Invalid Vote if an invalid votes is given to be updated", () => {
      const updatedContent = { inc_votes: "not-a-valid-vote" };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedContent)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid vote");
        });
    });
    test("PATCH 404: returns Not Found when given a non-existent article_id", () => {
      const updatedContent = { inc_votes: 2 };
      return request(app)
        .patch("/api/articles/999")
        .send(updatedContent)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article_id not found");
        });
    });
    test("PATCH 400: returns Bad Request when given an invalid article_id", () => {
      const updatedContent = { inc_votes: 2 };
      return request(app)
        .patch("/api/articles/not-an-id")
        .send(updatedContent)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("PATCH 200: defaults to 0 if the updated vote is in negatives", () => {
      const updatedContent = { inc_votes: -200 };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedContent)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBe(0);
          expect(body.article.article_id).toBe(1);
          expect(body.article.title).toBe(
            "Living in the shadow of a great man"
          );
          expect(body.article.topic).toBe("mitch");
          expect(body.article.author).toBe("butter_bridge");
          expect(body.article.body).toBe("I find this existence challenging");
          expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
  });
  describe("/api/articles", () => {
    test("GET 200: returns all the articles ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(13);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("GET 200: returns all the comments on an article given by article_id ordered by the most recent first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(11);
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
          body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
            expect(comment.article_id).toBe(1);
          });
        });
    });
    test("GET 404: returns Not Found when given a non-existent article_id", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article_id not found");
        });
    });
    test("GET 400: returns Bad Request when given an invalid article_id", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("GET 200: returns empty array if article doesn't have any comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("POST 201: inserts a new comment to the db and returns the new comment back to the client", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Love this article!!!",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comments.author).toBe("butter_bridge");
          expect(body.comments.body).toBe("Love this article!!!");
          expect(body.comments.article_id).toBe(2);
          expect(body.comments.votes).toBe(0);
          expect(typeof body.comments.created_at).toBe("string");
        });
    });
    test("POST 400: returns bad request if any required field in the comments body is empty", () => {
      const newComment = {
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("POST 404: returns Not Found when given a non-existent article_id", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Love this article!!!",
      };
      return request(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article_id not found");
        });
    });
    test("POST 400: returns Bad Request when given an invalid article_id", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Love this article!!!",
      };
      return request(app)
        .post("/api/articles/not-an-id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("POST 400: returns Bad Request if one of the field's given contains the wrong value type or if foreign key username doesn't exist", () => {
      const newComment = {
        username: 5,
        body: "Love this article!!!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
