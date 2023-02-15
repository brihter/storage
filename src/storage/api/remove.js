const Bluebird = require('bluebird')
const { Path } = require('../utils/path.js')
const { validatePath } = require('../utils/validators.js')

// TODO tidy removeApi
const removeApi = ({ provider, util, list }) => {
  const { scope } = Path(provider.config)

  // prettier-ignore
  const defaults = opts => Object.assign({
    recursive: false,
    concurrency: provider.config.concurrency
  }, opts)

  const getItems = async (path, opts) => {
    let toRemove = [path]

    if (opts.recursive) {
      const items = await list(path, {
        recursive: true,
        absolute: true,
        concurrency: opts.concurrency
      })

      toRemove = [...toRemove, ...items]
    }

    return toRemove
  }

  return async (path, opts = {}) => {
    opts = defaults(opts)
    validatePath(path)

    let toRemove = []
    toRemove = await getItems(path, opts)
    toRemove = toRemove.map(scope)

    await Bluebird.map(toRemove, provider.removeOne, opts)
  }
}

module.exports = {
  removeApi
}
