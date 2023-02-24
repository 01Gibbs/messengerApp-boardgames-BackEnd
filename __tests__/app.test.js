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
    describe('POST /api/reviews/:review_id/comments', () => {
      test('201: POST: responds with added comment', () => {
        return request(app)
          .post('/api/reviews/4/comments')
          .send({ username: 'mallionaire', body: 'testBody' })
          .expect(201)
          .then(({ body }) => {
            const expectedBody = {
              comment_id: 7,
              body: 'testBody',
              review_id: 4,
              author: 'mallionaire',
              votes: 0,
              created_at: expect.any(String),
            }
            expect(body).toMatchObject(expectedBody)
          })
      })
      test('201: POST: responds with added comment, without extra key', () => {
        return request(app)
          .post('/api/reviews/4/comments')
          .send({ username: 'mallionaire', body: 'testBody', crisps: 'Cheese' })
          .expect(201)
          .then(({ body }) => {
            const expectedBody = {
              comment_id: 7,
              body: 'testBody',
              review_id: 4,
              author: 'mallionaire',
              votes: 0,
              created_at: expect.any(String),
            }
            expect(body).toMatchObject(expectedBody)
          })
      })
      test('404: POST: respond with user not found when given invalid username', () => {
        return request(app)
          .post('/api/reviews/4/comments')
          .send({ username: 'Fish-Are-Friends', body: 'testBody' })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('user not found')
          })
      })
      test('400: POST: respond with comment not found', () => {
        return request(app)
          .post('/api/reviews/4/comments')
          .send({ username: 'mallionaire' })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: 'comment not found' })
          })
      })
      test('400: POST: respond with user not found when username not provided', () => {
        return request(app)
          .post('/api/reviews/4/comments')
          .send({ body: 'mallionaire' })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: 'user not found' })
          })
      })
      test('400: POST: responds with Bad Request for incorrect data type ', () => {
        return request(app)
          .post('/api/reviews/not-a-number/comments')
          .send({ username: 'mallionaire', body: 'testBody' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
          })
      })
      test('404: POST: valid path responds with non-existent id', () => {
        return request(app)
          .post('/api/reviews/72347/comments')
          .send({ username: 'mallionaire', body: 'testBody' })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('review does not exist')
          })
      })
    })
    describe('PATCH /api/reviews/:review_id', () => {
      test('200: PATCH: responds with updated review', () => {
        return request(app)
          .patch('/api/reviews/1')
          .send({ inc_votes: 1 })
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
      test('200: PATCH: responds with correct vote of increment one', () => {
        return request(app)
          .patch('/api/reviews/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(2)
          })
      })
      test('200: PATCH: responds with correct vote of decrement one', () => {
        return request(app)
          .patch('/api/reviews/1')
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(0)
          })
      })
      test('200: PATCH: responds with correct vote of increment ten', () => {
        return request(app)
          .patch('/api/reviews/1')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(11)
          })
      })
      test('200: PATCH: responds with correct vote of decrement ten', () => {
        return request(app)
          .patch('/api/reviews/1')
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(-9)
          })
      })
      test('200: PATCH: missing patch details responds with returning current review', () => {
        return request(app)
          .patch('/api/reviews/1')
          .send({})
          .expect(200)
          .then(({ body }) => {
            const expectedReview = {
              review: {
                review_id: 1,
                title: 'Agricola',
                category: 'euro game',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_body: 'Farmyard fun!',
                review_img_url:
                  'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                created_at: '2021-01-18T10:00:20.514Z',
                votes: 1,
              },
            }
            expect(body).toMatchObject(expectedReview)
          })
      })
      test('400: PATCH: responds with Bad Request for incorrect path id', () => {
        return request(app)
          .patch('/api/reviews/kev-taught-me-well')
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
          })
      })
      test('400: PATCH: responds with Bad Request when incorrect data type / votes is NaN', () => {
        return request(app)
          .patch('/api/reviews/1')
          .send({ inc_votes: 'not-a-number' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
          })
      })
      test('404: PATCH: non-existent review responds with review does not exist', () => {
        return request(app)
          .patch('/api/reviews/72347')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('review does not exist')
          })
      })
    })
    describe('GET /api/users', () => {
      test('200: GET: responds with server ok message', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length).toBe(4)
            body.users.forEach((user) => {
              expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            })
          })
      })
    })
  })
})
