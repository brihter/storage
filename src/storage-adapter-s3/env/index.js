import { homedir } from 'node:os'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import { URL } from 'node:url'
import ini from 'ini'

const __dirname = new URL('.', import.meta.url).pathname

const getCredentials = async provider => {
  let credentials

  try {
    credentials = await readFile(`${homedir()}/.${provider}/credentials`, {
      encoding: 'ascii'
    })
  } catch (err) {
    if (err.errno !== -2) throw err
  }

  if (credentials) {
    credentials = ini.parse(credentials)
  } else {
    let prefix = ''
    if (provider === 'aws') prefix = 'aws'
    if (provider === 'cloudflare') prefix = 'cf'
    if (provider === 'hetzner') prefix = 'hetzner'
    if (provider === 'backblaze') prefix = 'backblaze'
    credentials = {
      [process.env[`${prefix.toUpperCase()}_PROFILE`]]: {
        [`${prefix}_account_id`]:
          process.env[`${prefix.toUpperCase()}_ACCOUNT_ID`] || '',
        [`${prefix}_access_key_id`]:
          process.env[`${prefix.toUpperCase()}_ACCESS_KEY_ID`] || '',
        [`${prefix}_secret_access_key`]:
          process.env[`${prefix.toUpperCase()}_SECRET_ACCESS_KEY`] || ''
      }
    }
  }
  return credentials
}

const aws = async (cfg, ctx) => {
  if (!ctx.specifiedTypes.includes('s3')) {
    return cfg
  }

  if (!cfg.aws) {
    return cfg
  }

  let credentials
  credentials = await getCredentials('aws')
  credentials = credentials[process.env.AWS_PROFILE]

  cfg.aws.storageClient.credentials = {
    accessKeyId: credentials.aws_access_key_id,
    secretAccessKey: credentials.aws_secret_access_key
  }

  return cfg
}

const cloudflare = async (cfg, ctx) => {
  if (!ctx.specifiedTypes.includes('s3')) {
    return cfg
  }

  if (!cfg.cloudflare) {
    return cfg
  }

  let credentials
  credentials = await getCredentials('cloudflare')
  credentials = credentials[process.env.CF_PROFILE]

  cfg.cloudflare.storageClient.endpoint = `https://${credentials.cf_account_id}.r2.cloudflarestorage.com`
  cfg.cloudflare.storageClient.credentials = {
    accessKeyId: credentials.cf_access_key_id,
    secretAccessKey: credentials.cf_secret_access_key
  }

  return cfg
}

const hetzner = async (cfg, ctx) => {
  if (!ctx.specifiedTypes.includes('s3')) {
    return cfg
  }

  if (!cfg.hetzner) {
    return cfg
  }

  let credentials
  credentials = await getCredentials('hetzner')
  credentials = credentials[process.env.HETZNER_PROFILE]

  cfg.hetzner.storageClient.endpoint = `https://${cfg.hetzner.storageClient.region}.your-objectstorage.com`
  cfg.hetzner.storageClient.credentials = {
    accessKeyId: credentials.hetzner_access_key_id,
    secretAccessKey: credentials.hetzner_secret_access_key
  }

  return cfg
}

const backblaze = async (cfg, ctx) => {
  if (!ctx.specifiedTypes.includes('s3')) {
    return cfg
  }

  if (!cfg.backblaze) {
    return cfg
  }

  let credentials
  credentials = await getCredentials('backblaze')
  credentials = credentials[process.env.BACKBLAZE_PROFILE]

  cfg.backblaze.storageClient.endpoint = `https://s3.${cfg.backblaze.storageClient.region}.backblazeb2.com`
  cfg.backblaze.storageClient.credentials = {
    accessKeyId: credentials.backblaze_access_key_id,
    secretAccessKey: credentials.backblaze_secret_access_key
  }

  return cfg
}

const loadConfig = async (environment = process.env.NODE_ENV) => {
  let ctx = {}
  ctx.specifiedTypes = process.argv.filter(p => p.startsWith('--type')).map(p => p.split('=')[1])
  ctx.specifiedProviders = process.argv.filter(p => p.startsWith('--provider')).map(p => p.split('=')[1])

  let cfg = {}
  cfg = await readFile(join(__dirname, `../../../env/${environment}.json`), { encoding: 'ascii' })
  cfg = JSON.parse(cfg)

  // filter
  Object.keys(cfg).forEach(provider => {
    const providerMatches = ctx.specifiedProviders.length === 0 || ctx.specifiedProviders.includes(provider)
    const typeMatches = ctx.specifiedTypes.length === 0 || (cfg[provider].storage && ctx.specifiedTypes.includes(cfg[provider].storage.type))
    if (!providerMatches || !typeMatches) {
      delete cfg[provider]
    }
  })

  // enrich
  cfg = await aws(cfg, ctx)
  cfg = await cloudflare(cfg, ctx)
  cfg = await hetzner(cfg, ctx)
  cfg = await backblaze(cfg, ctx)

  return cfg
}

export { loadConfig }
