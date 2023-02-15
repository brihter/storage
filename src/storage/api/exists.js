const existsApi = ({ provider, util }) => {
  return async path => {
    util.path.validate(path)
    const pathScoped = util.path.scope(path)
    return await provider.exists(pathScoped)
  }
}

module.exports = {
  existsApi
}
