const iconv = require('iconv-lite')

const readApi = ({ provider, util }) => {
  // prettier-ignore
  const {
    validate,
    scope
  } = util.path

  // prettier-ignore
  const defaults = opts => Object.assign({
    encoding: provider.config.encoding
  }, opts)

  return async (path, opts = {}) => {
    opts = defaults(opts)
    validate(path, 'path', { isObjectPath: true })

    const buffer = await provider.read(scope(path))
    if (!buffer || opts.encoding === 'binary') {
      return buffer
    }

    return iconv.decode(buffer, opts.encoding)
  }
}

module.exports = {
  readApi
}
