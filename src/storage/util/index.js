const { Path } = require('./path.js')

const Util = ({ config }) => {
  const path = Path({ config })

  return {
    path
  }
}

module.exports = {
  Util
}
