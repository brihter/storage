const validate = data => {
  if (!data) {
    throw new TypeError('Invalid argument', {
      cause: `'data' missing`
    })
  }
}

const data = {
  validate
}

module.exports = {
  data
}
