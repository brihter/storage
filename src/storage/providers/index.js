const providerList = [require('./local.js'), require('./s3.js')]

const providers = providerList.reduce((map, provider) => {
  map[provider.type] = provider.impl
  return map
}, {})

module.exports = {
  providers
}
