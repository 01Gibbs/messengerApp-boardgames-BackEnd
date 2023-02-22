const db = require('../db/connection.js')

const fetchCommentsByReview = (reviewId) => {
  return db
    .query({
      text: `
      SELECT *
      FROM comments
      WHERE review_id = $1;
      `,
      values: [reviewId],
    })
    .then((result) => {
      // console.log(result)
      // console.log(result.rows, 'result.rows')
      if (result.rows.length < 1)
        return Promise.reject({
          status: 404,
          msg: 'id not found',
        })
      return result.rows
    })
}

module.exports = {
  fetchCommentsByReview,
}
