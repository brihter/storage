const iconv = require('iconv-lite')

const { Path } = require('../utils/path.js')
const { validateObjectPath } = require('../utils/validators.js')

const read = provider => {
  const { scope } = Path(provider.config)

  // prettier-ignore
  const defaults = opts => Object.assign({
    encoding: provider.config.encoding
  }, opts)

  return async (path, opts = {}) => {
    opts = defaults(opts)
    validateObjectPath(path)
    path = scope(path)

    const buffer = await provider.read(path)

    if (!buffer) return
    if (opts.encoding === 'binary') return buffer
    return iconv.decode(buffer, opts.encoding)
  }
}

module.exports = {
  read
}
