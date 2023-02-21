const {
  fetchCategories,
  fetchReview,
  fetchReviews,
} = require('../models/game-model.js')

const getCategories = (request, response) => {
  fetchCategories().then((categories) => {
    response.status(200).send({ categories })
  })
}

const getReview = (request, response) => {
  const reviewNumber = request.params.review_id
  fetchReview(reviewNumber)
    .then((review) => {
      response.status(200).send({ review })
    })
    .catch((err) => {
      response.status(404).send({ err })
    })
}

const getReviews = (request, response) => {
  fetchReviews().then((reviews) => {
    response.status(200).send({ reviews })
  })
}

module.exports = {
  getCategories,
  getReviews,
  getReview,
}
