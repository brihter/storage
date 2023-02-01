const { providers } = require('../providers')

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).uri()`, () => {
    let storage

    before(async () => {
      storage = global._conjure.getStorage(provider)
      await storage.remove('/')
      await Promise.all([storage.write('msg', 'hi')])
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'path'`, async () => {
        const err = await storage.uri().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' missing`)
      })

      it(`should throw on incorrect 'path'`, async () => {
        const err = await storage.uri(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should be a string`)
      })

      it(`should throw on empty 'path'`, async () => {
        const err = await storage.uri('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should contain a string`)
      })

      it(`should throw when path is not a file`, async () => {
        const err = await storage.uri('sub/').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`object 'path' should not end with a '/'`)
      })
    })

    describe('implementation', () => {
      it(`should return the uri`, async () => {
        const uri = await storage.uri('msg')
        const prefix = storage.config.type === 'local' ? 'file:///' : 'https://'
        expect(uri).to.satisfy(msg => msg.startsWith(prefix))
        expect(uri).to.satisfy(msg => msg.endsWith('msg'))
      })
    })

    describe('output', () => {
      it('should return a string', async () => {
        const uri = await storage.uri('msg')
        expect(uri).to.be.a('string')
      })

      it('should return undefined on no file', async () => {
        const uri = await storage.uri('wabaduba.mp3')
        expect(uri).to.be.undefined
      })
    })
  })
}

Object.keys(providers).forEach(run)
