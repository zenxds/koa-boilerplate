const request = require('supertest')
const app = require('../app')

describe('test/index.js', () => {

  test('should test index', done => {
    request(app.callback())
      .get('/')
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull()
        done()
      })
  })

})