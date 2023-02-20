const { fetchCategories } = require('../models/game-model.js')

const getCategories = (request, response) => {
  // response.status(200).send({ msg: 'hello there' })
  fetchCategories().then((categories) => {
    response.status(200).send({ categories })
  })
}

module.exports = {
  getCategories,
}
