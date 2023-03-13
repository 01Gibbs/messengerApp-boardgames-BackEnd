const { request } = require('../app.js')
const {
  fetchReview,
  fetchReviews,
  updateReview,
} = require('../models/review-model.js')

const getReview = (request, response, next) => {
  const reviewNumber = request.params.review_id
  fetchReview(reviewNumber)
    .then((review) => {
      response.status(200).send({ review })
    })
    .catch((err) => {
      next(err)
    })
}

const getReviewQueryRefactor = (request, response, next) => {
  const userId = request.params.user_id
  fetchUsers(userId).then((users) => {
    response.status(200).send({ users })
  })
}

const getReviews = (request, response) => {
  fetchReviews().then((reviews) => {
    response.status(200).send({ reviews })
  })
}

const patchReview = (request, response, next) => {
  const review_id = request.params.review_id
  const voteCount = request.body['inc_votes']
  updateReview(review_id, voteCount)
    .then((review) => {
      response.status(200).send({ review })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports = {
  getReview,
  getReviews,
  patchReview,
}
