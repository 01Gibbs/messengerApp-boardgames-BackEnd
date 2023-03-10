const express = require('express')
const cors = require('cors')
const app = express()
const { getCategories } = require('./controllers/category-controllers.js')
const {
  getCommentsByReview,
  postCommentByReview,
} = require('./controllers/comments-controllers.js')
const {
  getReview,
  getReviews,
  patchReview,
} = require('./controllers/review-controllers.js')
const { getUsers } = require('./controllers/user-controllers.js')
const {
  handle500s,
  handle404s,
  handleCustomErrors,
  handlePSQL400s,
} = require('./controllers/errorHandler-controllers.js')

app.use(cors())

app.use(express.json())

app.get('/api/categories', getCategories)

app.get('/api/reviews/:review_id/comments', getCommentsByReview)

app.get('/api/reviews/:review_id', getReview)

app.post('/api/reviews/:review_id/comments', postCommentByReview)

app.get('/api/reviews', getReviews)

app.patch('/api/reviews/:review_id', patchReview)

app.get('/api/users', getUsers)

app.use('/api/*', handle404s)

app.use(handlePSQL400s)

app.use(handleCustomErrors)

app.use(handle500s)

module.exports = app
