const existsApi = ({ provider, util }) => {
  // prettier-ignore
  const {
    validate,
    scope
  } = util.path

  return async path => {
    validate(path)
    const pathScoped = scope(path)
    return await provider.exists(pathScoped)
  }
}

module.exports = {
  existsApi
}
