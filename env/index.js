const homedir = require('os').homedir()
const { readFile } = require('fs').promises
const ini = require('ini')

const cf = async (cfg) => {
  let credentials
  credentials = await readFile(`${homedir}/.cloudflare/credentials`, { encoding: 'ascii' })
  credentials = ini.parse(credentials)
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
  cfg = await cf(cfg)
  return cfg
}

module.exports = {
  loadConfig
}
