const express = require('express')
const app = express()
const {
  getCategories,
  getReviews,
} = require('./controllers/game-controllers.js')
const { handle500s } = require('./controllers/errorHandler-controllers.js')

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

// 404 req res app.all/*

app.use(handle500s)

module.exports = app
