const express = require('express');
const {getTopics} = require('./controllers/topics.controller')
const {getApi} = require('./controllers/api.controller')
const {getArticleById} = require('./controllers/article.controller')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.use((err, req, res, next) => {
    if(err.msg === 'Invalid id'){
        res.status(404).send({msg: 'Not Found'})
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'Bad Request'})
    }
})

module.exports = app;