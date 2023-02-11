const listApi = ({ provider, util, exists }) => {
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
        return items.map(util.path.absolute)
      }

      return items.map(item => util.path.relative(item, path))
    }

    opts = defaults(opts)
    util.path.validate(path)

    const pathExists = await exists(path)
    if (!pathExists) {
      return []
    }

    let items = []
    const scopedPath = util.path.scope(path)
    items = await provider.list(scopedPath, opts)
    return format(items)
  }
}

module.exports = {
  listApi
}
