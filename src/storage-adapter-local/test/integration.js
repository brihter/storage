import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

before(() => {
  global.expect = chai.expect
  global.sinon = sinon
})

after(() => {
  delete global.sinon
  delete global.expect
})
