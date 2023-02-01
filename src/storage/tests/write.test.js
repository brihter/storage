const { providers } = require('../providers')

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).write()`, () => {
    let storage

    before(() => {
      storage = global._conjure.getStorage(provider)
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'path'`, async () => {
        const err = await storage.write().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' missing`)
      })

      it(`should throw on incorrect 'path'`, async () => {
        const err = await storage.write(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should be a string`)
      })

      it(`should throw on empty 'path'`, async () => {
        const err = await storage.write('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should contain a string`)
      })

      it(`should throw when path is not a file`, async () => {
        const err = await storage.write('sub/').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`object 'path' should not end with a '/'`)
      })

      it('should throw on missing data', async () => {
        const err = await storage.write('msg').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'data' missing`)
      })
    })

    describe('implementation', () => {
      it('should write', async () => {
        await storage.write('msg', 'hello1')
        const data = await storage.read('msg')
        expect(data).to.eql('hello1')
      })

      it('should write to nested paths', async () => {
        await storage.write('dir1/dir2/msg', 'hello2')
        const data = await storage.read('dir1/dir2/msg')
        expect(data).to.eql('hello2')
      })

      it('should encode', async () => {
        await storage.write('msg', 'hello', { encoding: 'ascii' })
        const data = await storage.read('msg')
        expect(data).to.eql('hello')
      })

      it('should encode as binary', async () => {
        const input = Buffer.alloc(4)
        await storage.write('msg', input, { encoding: 'binary' })
        const output = await storage.read('msg', { encoding: 'binary' })
        expect(Buffer.compare(input, output)).to.eql(0)
      })

      it('should encode as utf8 by default', async () => {
        await storage.write('msg', 'Ω')
        const data = await storage.read('msg')
        expect(data).to.eql('Ω')
      })
    })

    describe('output', () => {
      it('should return undefined', async () => {
        const result = await storage.write('msg', 'x')
        expect(result).to.be.undefined
      })
    })
  })
}

Object.keys(providers).forEach(run)
