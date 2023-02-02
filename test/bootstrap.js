const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { Storage } = require('../src/storage/storage.js')
const { providers } = require('../src/storage/providers')
const { loadConfig } = require('../env')

const createOne = async (runId, type) => {
  const cfg = await loadConfig()
  const cfgByType = cfg[type]
  cfgByType.storage.path += `/${runId}/`
  return Storage(cfgByType)
}

const createProviders = async runId => {
  let providerList = Object.keys(providers)
  providerList = await Promise.all(
    providerList.map(type => createOne(runId, type))
  )
  return providerList.reduce((acc, provider) => {
    acc[provider.config.type] = provider
    return acc
  }, {})
}

chai.use(sinonChai)

before(async () => {
  global.expect = chai.expect
  global.sinon = sinon

  const runId = Math.floor(new Date().getTime() / 1000)
  const storageProviders = await createProviders(runId)

  global._conjure = {
    runId,
    getStorage: provider => storageProviders[provider]
  }
})

after(async () => {
  delete global.sinon
  delete global.expect
  delete global._conjure
})
