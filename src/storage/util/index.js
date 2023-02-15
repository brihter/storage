const { Path } = require('./path.js')
const { data } = require('./data.js')
const { url } = require('./url.js')

const Util = ({ config }) => {
  const path = Path({ config })

  return {
    path,
    data,
    url
  }
}

module.exports = {
  Util
}
