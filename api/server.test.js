const api = require('../index');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

describe('[GET] Jokes endpoint', () => {
  it('[1] retrives jokes on successful request', () => {
    expect(true).toBe(false)
  })
  it('[2] does other stuff', () => {

  })
})
describe('[POST] Register endpoint', () => {
  it('[3] creates a new user in the database', () => {

  })
  it('[4] handles for missing username or password', () => {

  }) 
})
describe('[POST] Login endpoint', () => {
  it('[5] rejects bad password or username', () => {

  })
  it('[6] returns token ', () => {

  })
})
