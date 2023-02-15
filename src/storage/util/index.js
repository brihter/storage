const { Path } = require('./path.js')
const { data } = require('./data.js')

const Util = ({ config }) => {
  const path = Path({ config })

  return {
    path,
    data
  }
}

module.exports = {
  Util
}
