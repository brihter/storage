import { Storage } from './index.js'

describe('@brighter/storage-adapter-local', () => {
  describe('Storage()', () => {
    it('should create', async () => {
      const storage = Storage({
        path: '/tmp/storage'
      })

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
