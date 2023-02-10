const { providers } = require('./providers')
const { Util } = require('./util')

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

  const context = {
    provider,
    util: Util({ config: providerConfig })
  }

  return {
    config,
    client: provider.client,

    copy: copy(context),
    exists: exists(context),
    list: list(context),
    read: read(context),
    remove: remove(context),
    stat: stat(context),
    write: write(context)
  }
}

module.exports = {
  Storage
}
