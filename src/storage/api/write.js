import * as iconv from 'iconv-lite'

const writeApi = ({ provider, util }) => {
  // prettier-ignore
  const {
    validate: validatePath,
    scope
  } = util.path

  // prettier-ignore
  const {
    validate: validateData
  } = util.data

  // prettier-ignore
  const defaults = opts => Object.assign({
    encoding: provider.config.encoding
  }, opts)

  return async (path, data, opts = {}) => {
    opts = defaults(opts)

    validatePath(path, 'path', { isObjectPath: true })
    validateData(data)

    let buffer = data
    if (!(data instanceof Buffer)) {
      buffer = iconv.encode(data, opts.encoding)
    }

    await provider.write(scope(path), buffer, opts)
  }
}

export { writeApi }
