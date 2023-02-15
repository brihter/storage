const iconv = require('iconv-lite')

const { Path } = require('../utils/path.js')
const { validateObjectPath, validateData } = require('../utils/validators.js')

// TODO tidy writeApi
const writeApi = ({ provider, util }) => {
  const { scope } = Path(provider.config)

  // prettier-ignore
  const defaults = opts => Object.assign({
    encoding: provider.config.encoding
  }, opts)

  return async (path, data, opts = {}) => {
    opts = defaults(opts)
    validateObjectPath(path)
    validateData(data)
    path = scope(path)

    let buffer = data
    if (!(data instanceof Buffer)) {
      buffer = iconv.encode(data, opts.encoding)
    }

    await provider.write(path, buffer, opts)
  }
}

module.exports = {
  writeApi
}
