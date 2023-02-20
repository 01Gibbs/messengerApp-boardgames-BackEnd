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
    describe.only('GET /api/reviews', () => {
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
      test('returns array of objects ordered by date', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toStrictEqual(
              [...body.reviews].sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              })
            )
          })
      })
    })
  })
})
