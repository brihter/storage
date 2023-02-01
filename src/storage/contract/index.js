const { copy } = require('./copy.js')
const { exists } = require('./exists.js')
const { list } = require('./list.js')
const { read } = require('./read.js')
const { remove } = require('./remove.js')
const { stat } = require('./stat.js')
const { uri } = require('./uri.js')
const { write } = require('./write.js')

module.exports = {
  copy,
  exists,
  list,
  read,
  remove,
  stat,
  uri,
  write
}
