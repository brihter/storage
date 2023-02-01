const validatePath = (path, variableName = 'path') => {
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
}

const validateObjectPath = path => {
  validatePath(path)

  if (path.endsWith('/')) {
    throw new TypeError('Invalid argument', {
      cause: `object 'path' should not end with a '/'`
    })
  }
}

const validateData = data => {
  if (!data) {
    throw new TypeError('Invalid argument', {
      cause: `'data' missing`
    })
  }
}

module.exports = {
  validatePath,
  validateObjectPath,
  validateData
}
