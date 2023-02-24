const {
  fetchCommentsByReview,
  insertCommentByReview,
} = require('../models/comment-model')

const getCommentsByReview = (request, response, next) => {
  const reviewNumber = request.params.review_id
  fetchCommentsByReview(reviewNumber)
    .then((reviewComments) => {
      response.status(200).send({ reviewComments })
    })
    .catch((err) => {
      next(err)
    })
}

const postCommentByReview = (request, response, next) => {
  const review_id = request.params.review_id
  const username = request.body.username
  const comment = request.body.body
  insertCommentByReview(review_id, username, comment)
    .then((insertedComment) => {
      response.status(201).send(insertedComment)
    })
    .catch((err) => {
      next(err)
    })
}

module.exports = {
  getCommentsByReview,
  postCommentByReview,
}
