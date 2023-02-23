const express = require('express')
const app = express()
const { getCategories } = require('./controllers/category-controllers.js')
const { getCommentsByReview } = require('./controllers/comments-controllers.js')
const { getReview, getReviews } = require('./controllers/review-controllers.js')
const {
  handle500s,
  handle404s,
  handleCustomErrors,
  handlePSQL400s,
} = require('./controllers/errorHandler-controllers.js')

app.get('/api/categories', getCategories)

app.get('/api/reviews/:review_id/comments', getCommentsByReview)

app.get('/api/reviews/:review_id', getReview)

app.get('/api/reviews', getReviews)

app.use('/api/*', handle404s)

app.use(handlePSQL400s)

app.use(handleCustomErrors)

app.use(handle500s)

module.exports = app
