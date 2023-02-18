import { localProvider } from './local.js'
import { s3provider } from './s3.js'

// prettier-ignore
const providerList = [
  localProvider,
  s3provider
]

const providers = providerList.reduce((map, provider) => {
  map[provider.type] = provider.impl
  return map
}, {})

export { providers }
