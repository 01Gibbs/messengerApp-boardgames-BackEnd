const db = require('../db/connection.js')

const fetchReviews = () => {
  return db
    .query(
      `
        SELECT 
          r.owner, 
          r.title, 
          r.review_id,
          r.category,
          r.review_img_url,
          r.created_at,
          r.votes,
          r.designer,
          (SELECT COUNT(*) 
          FROM comments as c 
          where c.review_id = r.review_id) as comment_count
        FROM reviews as r
        ORDER BY r.created_at DESC;
          `
    )
    .then((result) => {
      if (result.rows.length < 1)
        return Promise.reject({
          status: 404,
          msg: 'id not found',
        })
      return result.rows
    })
}

const fetchReview = (reviewId) => {
  return db
    .query({
      text: `
        SELECT 
          review_id,
          title,
          review_body, 
          designer,
          review_img_url,
          votes,
          category,
          owner, 
          created_at
        FROM reviews 
        WHERE review_id = $1
          `,
      values: [reviewId],
    })
    .then((result) => {
      if (result.rows.length < 1)
        return Promise.reject({
          status: 404,
          msg: 'review not found',
        })
      return result.rows[0]
    })
}

module.exports = {
  fetchReview,
  fetchReviews,
}