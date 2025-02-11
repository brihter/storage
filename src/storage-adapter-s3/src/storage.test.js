import { loadConfig } from '../env/index.js'
import { Storage } from './index.js'

describe('@brighter/storage-adapter-s3', () => {
  let cfg

  before(async () => {
    const config = await loadConfig()
    cfg = config[Object.keys(config)[0]]
  })

  describe('Storage()', () => {
    it('should create', async () => {
      const storage = Storage(cfg.storage, cfg.storageClient)

      expect(storage).to.not.be.undefined
      expect(storage).to.have.keys([
        'config',
        'client',
        'exists',
        'copy',
        'list',
        'read',
        'remove',
        'stat',
        'write',
        'presign'
      ])
    })
  })
})
