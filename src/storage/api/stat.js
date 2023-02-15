const statApi = ({ provider, util }) => {
  // prettier-ignore
  const {
    validate,
    scope,
    unscope
  } = util.path

  return async path => {
    validate(path, 'path', { isObjectPath: true })

    const result = await provider.stat(scope(path))
    if (!result) {
      return
    }

    const endpoint = await provider.getEndpoint()
    result.url = provider.url(result.file, endpoint)
    result.file = unscope(result.file)
    return result
  }
}

module.exports = {
  statApi
}
