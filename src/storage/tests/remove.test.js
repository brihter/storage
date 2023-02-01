const { providers } = require('../providers')

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).remove()`, () => {
    let storage

    before(async () => {
      storage = global._conjure.getStorage(provider)

      await storage.remove('/', { recursive: true })
      await Promise.all([
        storage.write('msg1', 'hi'),
        storage.write('msg2', 'hi'),
        storage.write('msg3', 'hi'),
        storage.write('dir1/a1', 'hi'),
        storage.write('dir1/dir2/b1', 'hi'),
        storage.write('dir1/dir2/b2', 'hi')
      ])
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'path'`, async () => {
        const err = await storage.remove().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' missing`)
      })

      it(`should throw on incorrect 'path'`, async () => {
        const err = await storage.remove(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should be a string`)
      })

      it(`should throw on empty 'path'`, async () => {
        const err = await storage.remove('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should contain a string`)
      })
    })

    describe('implementation', () => {
      it('should remove', async () => {
        await storage.remove('msg1')
        const items = await storage.list('/')
        expect(items).to.not.have.members(['msg1'])
      })

      it('should remove recursively', async () => {
        await storage.remove('dir1/', { recursive: true })
        const items = await storage.list('/', { recursive: true })
        expect(items).to.not.have.members(['dir1/'])
      })

      it('should not throw when no file', async () => {
        await storage.remove('wabaduba.mp3')
        expect(1).to.eql(1)
      })
    })

    describe('output', () => {
      it('should return undefined', async () => {
        const result = await storage.remove('msg3')
        expect(result).to.be.undefined
      })
    })
  })
}

Object.keys(providers).forEach(run)
