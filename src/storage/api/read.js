const iconv = require('iconv-lite')

const readApi = ({ provider, util }) => {
  // prettier-ignore
  const defaults = opts => Object.assign({
    encoding: provider.config.encoding
  }, opts)

  const validate = path => {
    util.path.validateObjectPath(path)
  }

  return async (path, opts = {}) => {
    opts = defaults(opts)
    validate(path)

    const pathScoped = util.path.scope(path)
    const buffer = await provider.read(pathScoped)
    if (!buffer) {
      return
    }

    if (opts.encoding === 'binary') {
      return buffer
    }

    return iconv.decode(buffer, opts.encoding)
  }
}

module.exports = {
  readApi
}
