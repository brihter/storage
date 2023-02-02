const { providers } = require('../providers')

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).stat()`, () => {
    let storage

    before(async () => {
      storage = global._conjure.getStorage(provider)
      await storage.remove('/')
      await Promise.all([
        storage.write('msg', 'hi'),
        storage.write('sub/msg', 'hi')
      ])
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'path'`, async () => {
        const err = await storage.stat().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' missing`)
      })

      it(`should throw on incorrect 'path'`, async () => {
        const err = await storage.stat(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should be a string`)
      })

      it(`should throw on empty 'path'`, async () => {
        const err = await storage.stat('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should contain a string`)
      })

      it(`should throw when path is not a file`, async () => {
        const err = await storage.stat('sub/').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`object 'path' should not end with a '/'`)
      })
    })

    describe('implementation', () => {
      it(`should stat`, async () => {
        const result = await storage.stat('msg')
        expect(result.file).to.eql('msg')
        expect(result.size).to.eql(2)
        expect(result.modified).to.not.be.undefined
      })
    })

    describe('output', () => {
      it('should return a uniform object', async () => {
        const result = await storage.stat('msg')
        expect(result).to.be.an('object')
        expect(result).to.have.keys([
          'file',
          'contentType',
          'etag',
          'size',
          'modified'
        ])
        expect(result.file).to.be.a('string')
        expect(result.contentType).to.be.a('string')
        expect(result.etag).to.be.a('string')
        expect(result.size).to.be.a('number')
        expect(result.modified).to.be.a('date')
      })

      it('should return undefined on no file', async () => {
        const result = await storage.uri('wabaduba.mp3')
        expect(result).to.be.undefined
      })
    })
  })
}

Object.keys(providers).forEach(run)
