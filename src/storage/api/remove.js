const removeApi = ({ provider, util, list }) => {
  // prettier-ignore
  const {
    validate,
    scope
  } = util.path

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
    validate(path)

    let items = await getItems(path, opts)
    items = items.map(scope)
    await util.promise.map(items, provider.removeOne, opts)
  }
}

export { removeApi }
