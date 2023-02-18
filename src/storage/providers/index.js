// prettier-ignore
const providerList = [
  import S3 from '@aws-sdk/client-s3'./local.js'),
  import S3 from '@aws-sdk/client-s3'./s3.js')
]

const providers = providerList.reduce((map, provider) => {
  map[provider.type] = provider.impl
  return map
}, {})

export {
  providers
}
