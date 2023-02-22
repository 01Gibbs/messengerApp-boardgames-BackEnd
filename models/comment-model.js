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
      if (!rowCount) {
        return result.rows
      } else {
        return result.rows
      }
    })
}

module.exports = {
  fetchCommentsByReview,
}
