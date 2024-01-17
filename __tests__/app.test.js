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
      const expectedOutput = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
      };
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject(expectedOutput);
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
      const expectedOutput = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 101,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedContent)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject(expectedOutput);
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
        });
    });
    test("PATCH 400: returns Bad request if body is empty or does not include inc_votes", () => {
      const updatedContent = {};
      return request(app)
        .patch("/api/articles/1")
        .send(updatedContent)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid vote");
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
    test("GET 200: return articles filtered by a query (topic)", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("GET 400: returns Bad Request if an invalid query is given", () => {
      return request(app)
        .get("/api/articles?topic=not-a-valid-query")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid query");
        });
    });
    test("GET 200: returns empty array if query is valid but has no articles associated with it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
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
  describe("/api/comments/:comment_id", () => {
    test("DELETE 204: deletes comment by comment id", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("DELETE 400: returns Bad Request if given an invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/not-a-valid-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("DELETE 404: returns Not Found if comment_id is non-existent", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment_id not found");
        });
    });
  });
  describe("/api/users", () => {
    test("GET 200: returns all the users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
