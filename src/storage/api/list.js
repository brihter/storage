const listApi = ({ provider, util, exists }) => {
  // prettier-ignore
  const defaults = opts => Object.assign({
    recursive: false,
    absolute: false,
    concurrency: provider.config.concurrency
  }, opts)

  const format = (items, path, opts) => {
    if (opts.absolute) {
      return items.map(util.path.absolute)
    }

    return items.map(item => util.path.relative(item, path))
  }

  return async (path, opts = {}) => {
    opts = defaults(opts)
    util.path.validate(path)

    const pathExists = await exists(path)
    if (!pathExists) {
      return []
    }

    const pathScoped = util.path.scope(path)

    let items = []
    items = await provider.list(pathScoped, opts)
    items = format(items, path, opts)
    return items
  }
}

module.exports = {
  listApi
}
