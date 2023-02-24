const db = require('../db/connection.js')

const fetchCommentsByReview = (reviewId) => {
  const queryReviewExists = db.query({
    text: `
    SELECT * 
    FROM reviews
    WHERE review_id = $1;
    `,
    values: [reviewId],
  })
  const queryCommentsByReview = db.query({
    text: `
      SELECT *
      FROM comments
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

const insertCommentByReview = (review_id, username, comment) => {
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: 'user not found',
    })
  } else if (!comment) {
    return Promise.reject({
      status: 400,
      msg: 'comment not found',
    })
  }
  const queryInsertComment = db.query({
    text: `
    INSERT INTO comments
    (review_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    values: [review_id, username, comment],
  })
  return queryInsertComment.then((result) => {
    if (result.rows < 1) {
      return Promise.reject({
        status: 404,
        msg: 'review not found',
      })
    } else {
      return result.rows[0]
    }
  })
}

module.exports = {
  fetchCommentsByReview,
  insertCommentByReview,
}
