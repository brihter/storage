const { Path } = require('../utils/path.js')
const { validateObjectPath } = require('../utils/validators.js')

const uri = provider => {
  const { scope } = Path(provider.config)

  return async path => {
    validateObjectPath(path)

    path = scope(path)
    const exists = await provider.exists(path)

    if (!exists) return
    return await provider.uri(path)
  }
}

module.exports = {
  uri
}
