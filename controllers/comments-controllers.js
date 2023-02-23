const { fetchCommentsByReview } = require('../models/comment-model')

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

module.exports = {
  getCommentsByReview,
}
