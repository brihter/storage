import { providers } from './providers/index.js'
import { Util } from './util/index.js'

// prettier-ignore
import {
  copyApi,
  existsApi,
  listApi,
  readApi,
  removeApi,
  statApi,
  writeApi,
  presignApi
} from './api/index.js'

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

  const ctx = {
    provider,
    util: Util({ config: providerConfig })
  }

  const exists = existsApi(ctx)
  const stat = statApi(ctx)
  const write = writeApi(ctx)
  const read = readApi(ctx)
  const presign = presignApi(ctx)
  const list = listApi({ ...ctx, exists })
  const copy = copyApi({ ...ctx, exists, list })
  const remove = removeApi({ ...ctx, list })

  return {
    config,
    client: provider.client,

    exists,
    copy,
    list,
    read,
    remove,
    stat,
    write,
    presign
  }
}

export { Storage }
