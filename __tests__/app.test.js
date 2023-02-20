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
  })
})
