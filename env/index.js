const homedir = require('os').homedir()
const { readFile } = require('fs').promises
const ini = require('ini')

const getCredentials = async (provider) => {
  let credentials

  try {
    credentials = await readFile(`${homedir}/.${provider}/credentials`, { encoding: 'ascii' })  
  } catch (err) {
    if (err.errno !== -2)
      throw err
  }

  if (credentials) {
    credentials = ini.parse(credentials)
  } else {
    let prefix = ''
    if (provider === 'aws') prefix = 'aws'
    if (provider === 'cloudflare') prefix = 'cf'
    credentials = {
      [process.env[`${prefix.toUpperCase()}_PROFILE`]]: {
        [`${prefix}_account_id`]: process.env[`${prefix}_ACCOUNT_ID`] || '',
        [`${prefix}_access_key_id`]: process.env[`${prefix}_ACCESS_KEY_ID`] || '',
        [`${prefix}_secret_access_key`]: process.env[`${prefix}_SECRET_ACCESS_KEY`] || '',
      }
    }
  }
  return credentials
}

const aws = async (cfg) => {
  let credentials
  credentials = await getCredentials('aws')
  credentials = credentials[process.env.AWS_PROFILE]

  cfg.r2.storageClient.credentials = {
    accessKeyId: credentials.aws_access_key_id,
    secretAccessKey: credentials.aws_secret_access_key
  }

  return cfg
}

const cf = async (cfg) => {
  let credentials
  credentials = await getCredentials('cloudflare')
  credentials = credentials[process.env.CF_PROFILE]

  cfg.r2.storageClient.endpoint = `https://${credentials.cf_account_id}.r2.cloudflarestorage.com`
  cfg.r2.storageClient.credentials = {
    accessKeyId: credentials.cf_access_key_id,
    secretAccessKey: credentials.cf_secret_access_key
  }

  return cfg
}

const loadConfig = async (environment = process.env.NODE_ENV) => {
  let cfg
  cfg = await readFile(`${__dirname}/${environment}.json`, { encoding: 'ascii' })
  cfg = JSON.parse(cfg)
  cfg = await aws(cfg)
  cfg = await cf(cfg)
  console.log(cfg)
  process.exit()
  return cfg
}

module.exports = {
  loadConfig
}
