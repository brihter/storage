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

    result.url = await provider.url(result.file)
    result.file = unscope(result.file)
    return result
  }
}

export { statApi }
