const { Path } = require('../utils/path.js')
const { validatePath } = require('../utils/validators.js')

const { exists } = require('./exists.js')

const list = provider => {
  const { scope, absolute, relative } = Path(provider.config)

  const doExists = exists(provider)

  const defaults = opts => {
    return Object.assign(
      {
        recursive: false,
        absolute: false,
        concurrency: provider.config.concurrency
      },
      opts
    )
  }

  return async (path, opts = {}) => {
    const format = items => {
      if (opts.absolute) {
        return items.map(absolute)
      }

      return items.map(item => relative(item, path))
    }

    opts = defaults(opts)
    validatePath(path)

    const exists = await doExists(path)
    if (!exists) return []

    let items = []
    items = await provider.list(scope(path), opts)
    return format(items)
  }
}

module.exports = {
  list
}
