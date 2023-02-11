const existsApi = ({ provider, util }) => {
  return async path => {
    util.path.validate(path)
    const scopedPath = util.path.scope(path)
    return await provider.exists(scopedPath)
  }
}

module.exports = {
  existsApi
}
