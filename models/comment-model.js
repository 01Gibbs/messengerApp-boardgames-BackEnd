const db = require('../db/connection.js')

const fetchCommentsByReview = (reviewId) => {
  const queryCommentsByReview = db.query({
    text: `
      SELECT *
      FROM comments
      WHERE review_id = $1;
      `,
    values: [reviewId],
  })
  const queryReviewExists = db.query({
    text: `
    SELECT * 
    FROM reviews
    WHERE review_id = $1;
    `,
    values: [reviewId],
  })
  return Promise.all([queryReviewExists, queryCommentsByReview]).then(
    ([reviewResult, commentsResult]) => {
      if (reviewResult.rows.length < 1) {
        return Promise.reject({
          status: 404,
          msg: 'review does not exist',
        })
      } else if (commentsResult.rows.length < 1) {
        return Promise.reject({
          status: 200,
          msg: 'comments not found',
        })
      } else {
        return commentsResult.rows
      }
    }
  )
}

module.exports = {
  fetchCommentsByReview,
}
