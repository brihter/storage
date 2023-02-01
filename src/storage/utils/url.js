const Url = require('url')

const url2parts = url => {
  const parts = Url.parse(`https://${url}`)

  let Bucket = parts.hostname

  let Key
  Key = parts.pathname
  Key = Key.substring(1)

  return {
    Bucket,
    Key
  }
}

module.exports = {
  url2parts
}
