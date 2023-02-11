const { Path } = require('../utils/path.js')
const { validateObjectPath } = require('../utils/validators.js')
const { url2parts } = require('../utils/url.js')

const statApi = ({ provider, util }) => {
  const { type } = provider.config
  const { scope, unscope } = Path(provider.config)

  const getEndpoint = async () => {
    if (type === 'local') {
      return ''
    }

    if (!provider.client.config.endpoint) {
      return 'https://s3.amazonaws.com'
    }

    const { hostname } = await provider.client.config.endpoint()
    return `https://${hostname}`
  }

  const url = (path, endpoint) => {
    if (type === 'local') {
      return `file://${path}`
    }

    const { Bucket, Key } = url2parts(path)
    return `${endpoint}/${Bucket}/${Key}`
  }

  const uri = (path, endpoint) => {
    if (type === 'local') {
      return `file://${path}`
    }

    return url(path, endpoint).replace(`${endpoint}/`, `${type}://`)
  }

  return async path => {
    validateObjectPath(path)
    const result = await provider.stat(scope(path))
    if (!result) {
      return
    }

    const endpoint = await getEndpoint()
    result.uri = uri(result.file, endpoint)
    result.url = url(result.file, endpoint)
    result.file = unscope(result.file)
    return result
  }
}

module.exports = {
  statApi
}
