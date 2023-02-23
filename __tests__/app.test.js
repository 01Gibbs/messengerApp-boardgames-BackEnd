const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require('../db/data/test-data')

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData })
})
afterAll(() => db.end())

describe('app', () => {
  describe('API Tests', () => {
    describe('GET /api/categories', () => {
      test('200: GET: responds with server ok message', () => {
        return request(app)
          .get('/api/categories')
          .expect(200)
          .then(({ body }) => {
            expect(body.categories.length).toBe(4)
            body.categories.forEach((category) => {
              expect(category).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              })
            })
          })
      })
    })
    describe('GET /api/reviews', () => {
      test('200: GET: responds with server ok message', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews.length).toBe(13)
            body.reviews.forEach((review) => {
              expect(review).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(String),
              })
            })
          })
      })
      test('200: GET: comment_count is correct', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(
              body.reviews.find((review) => review.review_id === 1)
                .comment_count
            ).toBe('0')
            expect(
              body.reviews.find((review) => review.review_id === 2)
                .comment_count
            ).toBe('3')
            expect(
              body.reviews.find((review) => review.review_id === 3)
                .comment_count
            ).toBe('3')
          })
      })
      test('200: GET: returns array of objects ordered by date', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy('created_at', {
              descending: true,
            })
          })
      })
    })
    describe('GET /api/reviews/:review_id', () => {
      test('200: GET: responds with server ok message', () => {
        return request(app)
          .get('/api/reviews/1')
          .expect(200)
          .then(({ body }) => {
            expect(body.review).toMatchObject({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),
            })
          })
      })
      test('404: GET: respond with not found', () => {
        return request(app)
          .get('/api/reviews/999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('review not found')
          })
      })
    })
    describe('GET /api/reviews/:review_id/comments', () => {
      test('200: GET: responds with comments object', () => {
        return request(app)
          .get('/api/reviews/2/comments')
          .expect(200)
          .then(({ body }) => {
            body.reviewComments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                review_id: expect.any(Number),
              })
            })
          })
      })
      test('200: GET: responds with empty comment array if none found', () => {
        return request(app)
          .get('/api/reviews/1/comments')
          .expect(200)
          .then(({ body }) => {
            console.log(body)
            expect(body.msg).toBe('comments not found')
          })
      })
      test('404: GET: respond with review does not exist', () => {
        return request(app)
          .get('/api/reviews/999/comments')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('review does not exist')
          })
      })
      test('400: GET: responds with bad request when provided non-existent review_id', () => {
        return request(app)
          .get('/api/reviews/not-valid/comments')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
          })
      })
    })
  })
})
