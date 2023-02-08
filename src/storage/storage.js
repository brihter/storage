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

// prettier-ignore
const createConfig = (config = {}) => Object.assign({
  encoding: 'utf8',
  concurrency: 32
}, config)

const createProvider = (config, dependencies = {}) => {
  if (!providers[config.type]) {
    throw new Error(`Unknown provider type '${config.type}'.`)
  }

  return providers[config.type](config, dependencies)
}

const Storage = (config, dependencies) => {
  const providerConfig = createConfig(config)
  const provider = createProvider(providerConfig, dependencies)

  return {
    config: providerConfig,
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
