const { providers } = require('../providers')

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).read()`, () => {
    let storage

    before(async () => {
      storage = global._conjure.getStorage(provider)
      await storage.remove('/', { recursive: true })
      await Promise.all([
        storage.write('msg', 'read'),
        storage.write('sub/msg', 'readsub'),
        storage.write('msg_ascii', '01AZ!?', { encoding: 'ascii' }),
        storage.write('msg_unicode', 'Ω'),
        storage.write('msg_binary', Buffer.alloc(4), { encoding: 'binary' })
      ])
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'path'`, async () => {
        const err = await storage.read().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' missing`)
      })

      it(`should throw on incorrect 'path'`, async () => {
        const err = await storage.read(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should be a string`)
      })

      it(`should throw on empty 'path'`, async () => {
        const err = await storage.read('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should contain a string`)
      })

      it(`should throw when path is not a file`, async () => {
        const err = await storage.read('sub/').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`object 'path' should not end with a '/'`)
      })
    })

    describe('implementation', () => {
      it('should read', async () => {
        const data = await storage.read('msg')
        expect(data).to.eql('read')
      })

      it('should read from nested paths', async () => {
        const data = await storage.read('sub/msg')
        expect(data).to.eql('readsub')
      })

      it('should decode', async () => {
        const data = await storage.read('msg_ascii', { encoding: 'ascii' })
        expect(data).to.eql('01AZ!?')
      })

      it('should decode as binary', async () => {
        const buffer = await storage.read('msg_binary', { encoding: 'binary' })
        expect(Buffer.compare(buffer, Buffer.alloc(4))).to.eql(0)
      })

      it('should decode as utf8 by default', async () => {
        const data = await storage.read('msg_unicode')
        expect(data).to.eql('Ω')
      })
    })

    describe('output', () => {
      it('should return on file', async () => {
        const data = await storage.read('msg')
        expect(data).to.not.be.undefined
      })

      it('should return undefined on no file', async () => {
        const data = await storage.read('wabaduba.mp3')
        expect(data).to.be.undefined
      })

      it('should return text', async () => {
        const data = await storage.read('msg')
        expect(typeof data).to.eql('string')
      })

      it('should return buffer', async () => {
        const data = await storage.read('msg_binary', { encoding: 'binary' })
        expect(data instanceof Buffer).to.eql(true)
      })
    })
  })
}

Object.keys(providers).forEach(run)
