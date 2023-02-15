const listApi = ({ provider, util, exists }) => {
  // prettier-ignore
  const {
    validate,
    scope,
    absolute,
    relative
  } = util.path

  // prettier-ignore
  const defaults = opts => Object.assign({
    recursive: false,
    absolute: false,
    concurrency: provider.config.concurrency
  }, opts)

  return async (path, opts = {}) => {
    const format = item => {
      return opts.absolute ? absolute(item) : relative(item, path)
    }

    opts = defaults(opts)
    validate(path)

    const pathExists = await exists(path)
    if (!pathExists) {
      return []
    }

    const items = await provider.list(scope(path), opts)
    return items.map(format)
  }
}

module.exports = {
  listApi
}
