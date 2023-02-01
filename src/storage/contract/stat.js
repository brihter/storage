const { Path } = require('../utils/path.js')
const { validateObjectPath } = require('../utils/validators.js')

const stat = provider => {
  const { scope, unscope } = Path(provider.config)

  return async path => {
    validateObjectPath(path)
    const result = await provider.stat(scope(path))
    result.file = unscope(result.file)
    return result
  }
}

module.exports = {
  stat
}
