const presignApi = ({ provider, util }) => {
  // prettier-ignore
  const {
    validate,
    scope
  } = util.path

  // prettier-ignore
  const defaults = opts => Object.assign({
    expiresIn: 3600
  }, opts)

  return async (path, opts = {}) => {
    opts = defaults(opts)
    validate(path, 'path', { isObjectPath: true })
    return await provider.presign(scope(path), opts)
  }
}

export { presignApi }
