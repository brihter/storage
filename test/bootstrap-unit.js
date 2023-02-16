const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

before(() => {
  global.expect = chai.expect
  global.sinon = sinon
})

after(() => {
  delete global.sinon
  delete global.expect
})
