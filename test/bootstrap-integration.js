const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const S3 = require('@aws-sdk/client-s3')
const S3Presign = require('@aws-sdk/s3-request-presigner')

const { Storage } = require('../src/storage/storage.js')
const { loadConfig } = require('../env')

const createOne = async (runId, type) => {
  const cfg = await loadConfig()
  const cfgByType = cfg[type]
  cfgByType.storage.path += `/${runId}/`

  const config = cfgByType.storage

  let dependencies = {}
  if (config.type === 's3') {
    dependencies = {
      client: S3,
      clientPresign: S3Presign,
      clientInstance: new S3.S3Client(cfgByType.storageClient)
    }
  }

  return {
    provider: type,
    storage: Storage(config, dependencies)
  }
}

const createProviders = async runId => {
  const cfg = await loadConfig()

  let providerList = Object.keys(cfg)
  providerList = await Promise.all(
    providerList.map(type => createOne(runId, type))
  )

  return providerList.reduce((acc, curr) => {
    acc[curr.provider] = curr.storage
    return acc
  }, {})
}

chai.use(sinonChai)

before(async () => {
  global.expect = chai.expect
  global.sinon = sinon

  const runId = Math.floor(new Date().getTime() / 1000)
  const storageProviders = await createProviders(runId)

  const specifiedProviders = process.argv
    .filter(p => p.startsWith('--provider'))
    .map(p => p.split('=')[1])

  global._storage = {
    runId,
    listProviders: () => {
      const list = Object.keys(storageProviders)
      if (specifiedProviders.length === 0) {
        return list
      }

      return list.filter(i => specifiedProviders.includes(i))
    },
    getStorage: provider => storageProviders[provider]
  }
})

after(async () => {
  delete global.sinon
  delete global.expect
  delete global._storage
})
