const express = require('express')
const app = express()
const { getCategories } = require('./controllers/game-controllers.js')
const { handle500s } = require('./controllers/errorHandler-controllers.js')

app.get('/api/categories', getCategories)

app.use(handle500s)

module.exports = app
