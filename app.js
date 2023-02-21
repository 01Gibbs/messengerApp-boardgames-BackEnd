const express = require('express')
const app = express()
const {
  getCategories,
  getReview,
  getReviews,
} = require('./controllers/game-controllers.js')
const {
  handle500s,
  handle404s,
} = require('./controllers/errorHandler-controllers.js')

app.get('/api/categories', getCategories)

app.get('/api/reviews/:review_id', getReview)

app.get('/api/reviews', getReviews)

app.all('/api/*', handle404s)

app.use(handle500s)

module.exports = app
