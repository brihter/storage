const { join } = require('path')

const Path = ({ config }) => {
  const validate = (path, variableName = 'path', opts = {}) => {
    if (typeof path === 'undefined') {
      throw new TypeError('Invalid argument', {
        cause: `'${variableName}' missing`
      })
    }

    if (typeof path !== 'string') {
      throw new TypeError('Invalid argument', {
        cause: `'${variableName}' should be a string`
      })
    }

    if (path.length === 0) {
      throw new TypeError('Invalid argument', {
        cause: `'${variableName}' should contain a string`
      })
    }

    if (!opts.isObjectPath) {
      return
    }

    if (path.endsWith('/')) {
      throw new TypeError('Invalid argument', {
        cause: `'${variableName}' should not end with a '/'`
      })
    }
  }

  const scope = (path = '/') => {
    return join(config.path, path)
  }

  const unscope = (scopedPath = '') => {
    return scopedPath.replace(config.path, '')
  }

  const absolute = fullPath => {
    const prefix = path => {
      if (!path.startsWith('/')) path = `/${path}`
      return path
    }

    let path = fullPath
    path = unscope(path)
    path = prefix(path)
    return path
  }

  const relative = (fullPath, rootPath) => {
    const format = path => {
      const prefix = join(config.path, rootPath)
      return path.replace(prefix, '')
    }

    let path = fullPath
    path = format(path)
    return path
  }

  return {
    validate,
    scope,
    unscope,
    absolute,
    relative
  }
}

module.exports = {
  Path
}
