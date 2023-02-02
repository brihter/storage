const { join } = require('path')

const Path = config => {
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
    scope,
    unscope,
    absolute,
    relative
  }
}

module.exports = {
  Path
}
