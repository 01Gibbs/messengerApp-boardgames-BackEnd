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

module.exports = {
  fetchCategories,
  fetchReviews,
}
