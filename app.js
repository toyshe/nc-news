const express = require("express");

const apiRouter = require("./routes/api-router");
const { errors404, psqlErrors, internalServerError } = require("./error-handling");


const app = express();
app.use(express.json());

app.use('/api', apiRouter)

app.use(errors404);

app.use(psqlErrors);

app.use(internalServerError)

module.exports = app;
