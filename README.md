
# Northcoders News API

Welcome to the Northcoders News Express. Here you will find the latest news regarding tech, sports, food and many more.

For the HOST API, [click here](https://nc-news-a0hr.onrender.com/)

To install and set up your own repo, read on down below:

## SETTING UP YOUR OWN REPO

### To set up your own repo:

1. Fork this repo
2. Clone this repo

```
git clone https://github.com/toyshe/nc-news
```


## INSTALL ALL DEPENDENCIES

### To install all dependecies:

`npm install`

NOTE: all packages are already listed in the package.json but just to make sure check if you have the following dependencies (and the command to install the packages if it's not listed)

jest -> `npm install --save-dev jest`

jest-sorted -> `npm install --save-dev jest-sorted`

pg-format -> `npm install -D pg-format`

supertest -> `npm install --save-dev supertest`

dotenv -> `npm install dotenv`

express -> `npm install express`

pg -> `npm install pg`


## CONNECT TO THE PSQL DATABASES

There are two databases available in this repository: development data that contains "real" data and test data to test for endpoints and such.

To connect to the PSQL databases, set up the following documents with the relevant code:

`.env.development`

```
PGDATABASE=nc_news
```

`.env.test`

```
PGDATABASE=nc_news_test
```

## RUN THE FILE

### To seed this file, run the following commands:

`npm run setup-dbs`

`npm run seed`

### To run the test file, run the following command:

`npm test`


## ENDPOINTS AVAILABLE ON THIS API

```ruby
GET /api

GET /api/topics

GET /api/articles
GET /api/articles/:article_id
PATCH /api/articles/:article_id

GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
DELETE /api/comments/:comment_id

GET /api/users/

```
