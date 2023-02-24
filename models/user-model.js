const db = require('../db/connection.js')

const fetchUsers = (userId) => {
  let queryString = `SELECT * FROM users`
  const queryParams = []

  if (userId !== undefined) {
    queryString += `WHERE user_id = $1`
    queryParams.push(userId)
  }

  return db.query(queryString, queryParams).then((result) => {
    const rowCount = result.rowCount
    if (rowCount < 1) {
      return Promise.reject({ status: 404, msg: 'user not found' })
    } else {
      if (rowCount === 1) {
        return result.rows[0]
      } else {
        return result.rows
      }
    }
  })
}

module.exports = {
  fetchUsers,
}
