const { fetchReview, fetchReviews } = require('../models/review-model.js')

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

const getReviews = (request, response) => {
  fetchReviews().then((reviews) => {
    response.status(200).send({ reviews })
  })
}

module.exports = {
  getReview,
  getReviews,
}
