const { impl: S3 } = require('./s3.js')
const { url2parts } = require('../utils/url.js')

const impl = config => {
  const s3 = S3(config)

  const uri = async path => {
    const { Bucket, Key } = url2parts(path)
    return `${config.storageClient.endpoint}/${Bucket}/${Key}`
  }

  return {
    ...s3,
    config: config.storage,
    uri
  }
}

module.exports = {
  type: 'r2',
  impl
}
