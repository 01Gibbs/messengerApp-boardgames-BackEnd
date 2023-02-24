const { fetchUsers } = require('../models/user-model')

const getUsers = (request, response, next) => {
  const userId = request.params.user_id
  fetchUsers(userId).then((users) => {
    response.status(200).send({ users })
  })
}

module.exports = {
  getUsers,
}
