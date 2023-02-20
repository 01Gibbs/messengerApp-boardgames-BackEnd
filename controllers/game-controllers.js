const { fetchCategories, fetchReviews } = require('../models/game-model.js')

const getCategories = (request, response) => {
  fetchCategories().then((categories) => {
    response.status(200).send({ categories })
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
}
