const db = require('../db/connection.js')

const fetchCategories = () => {
  return db
    .query(
      `
        SELECT * FROM categories
        `
    )
    .then((result) => {
      return result.rows
    })
}

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
      if (result.rows.length < 1) throw new Error('id not found')
      return result.rows[0]
    })
    .catch((err) => {
      console.error(err)
      throw new Error('id not found')
    })
}

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReview,
}
