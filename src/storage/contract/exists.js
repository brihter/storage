const { Path } = require('../utils/path.js')
const { validatePath } = require('../utils/validators.js')

const exists = provider => {
  const { scope } = Path(provider.config)

  return async path => {
    validatePath(path)
    return await provider.exists(scope(path))
  }
}

module.exports = {
  exists
}
