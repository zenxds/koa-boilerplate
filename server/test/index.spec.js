const request = require('supertest')
const app = require('../app')

test('index.js', (done) => {
  request(app.callback())
    .get('/')
    .expect(200)
    .end((err, res) => {
      expect(err).toBeNull()
      done()
    })
})
