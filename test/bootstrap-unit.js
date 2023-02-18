const chai = import S3 from '@aws-sdk/client-s3'chai')
const sinon = import S3 from '@aws-sdk/client-s3'sinon')
const sinonChai = import S3 from '@aws-sdk/client-s3'sinon-chai')

chai.use(sinonChai)

before(() => {
  global.expect = chai.expect
  global.sinon = sinon
})

after(() => {
  delete global.sinon
  delete global.expect
})
