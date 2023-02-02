const Bluebird = require('bluebird')
const { Path } = require('../utils/path.js')
const { validatePath } = require('../utils/validators.js')

const { list } = require('./list.js')

const remove = provider => {
  const { scope } = Path(provider.config)

  const doList = list(provider)

  // prettier-ignore
  const defaults = opts => Object.assign({
    recursive: false,
    concurrency: provider.config.concurrency
  }, opts)

  const getItems = async (path, opts) => {
    let toRemove = [path]

    if (opts.recursive) {
      const items = await doList(path, {
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
  remove
}
