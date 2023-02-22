const { fetchCommentsByReview } = require('../models/comment-model')

const getCommentsByReview = (request, response) => {
  const reviewNumber = request.params.review_id
  fetchCommentsByReview(reviewNumber).then((reviewComments) => {
    response.status(200).send({ reviewComments })
  })
}

module.exports = {
  getCommentsByReview,
}
