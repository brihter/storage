const { providers } = require('./providers')

// prettier-ignore
const {
  copy,
  exists,
  list,
  read,
  remove,
  stat,
  write
} = require('./contract')

const createConfig = (config = {}) => ({
  storage: Object.assign(
    {
      encoding: 'utf8',
      concurrency: 32
    },
    config.storage
  ),
  storageClient: config.storageClient || {}
})

const createProvider = (config = {}) => {
  if (!providers[config.storage.type]) {
    throw new Error(`Unknown provider '${config.storage.type}'`)
  }

  return providers[config.storage.type](config)
}

const Storage = config => {
  const providerConfig = createConfig(config)
  const provider = createProvider(providerConfig)

  return {
    config: providerConfig.storage,
    client: provider.client,

    copy: copy(provider),
    exists: exists(provider),
    list: list(provider),
    read: read(provider),
    remove: remove(provider),
    stat: stat(provider),
    write: write(provider)
  }
}

module.exports = {
  Storage
}
