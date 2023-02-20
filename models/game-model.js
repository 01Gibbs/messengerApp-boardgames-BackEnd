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
        COUNT(c.*) as comment_count 
      FROM reviews as r
      LEFT JOIN comments as c 
      ON c.review_id = r.review_id
      GROUP BY r.review_id
      ORDER BY r.created_at DESC;
        `
    )
    .then((result) => {
      return result.rows
    })
}

module.exports = {
  fetchCategories,
  fetchReviews,
}
