const { fetchCategories } = require('../models/category-model.js')

const getCategories = (request, response) => {
  fetchCategories().then((categories) => {
    response.status(200).send({ categories })
  })
}

module.exports = {
  getCategories,
}
