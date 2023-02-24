const db = require('../db/connection.js')

const fetchUsers = (userId) => {
  const queryString = `SELECT * FROM users`

  return db.query(queryString).then((result) => {
    const rowCount = result.rowCount

    return result.rows
  })
}

module.exports = {
  fetchUsers,
}
