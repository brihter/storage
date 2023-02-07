const Url = require('url')

const url2parts = url => {
  if (!url.startsWith('http://') || !url.startsWith('https://')) {
    url = `https://${url}`
  }

  const parts = Url.parse(url)

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
