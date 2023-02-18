const axios = require('axios')

describe('Storage().presign()', () => {
  let providers
  before(() => (providers = global._storage.listProviders()))
  it('run', () => providers.forEach(run))
})

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).presign()`, () => {
    let storage

    before(async () => {
      storage = global._storage.getStorage(provider)
      await storage.remove('/', { recursive: true })
      await Promise.all([storage.write('msg', 'hi')])
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'path'`, async () => {
        const err = await storage.presign().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' missing`)
      })

      it(`should throw on incorrect 'path'`, async () => {
        const err = await storage.presign(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should be a string`)
      })

      it(`should throw on empty 'path'`, async () => {
        const err = await storage.presign('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should contain a string`)
      })

      it(`should throw when path is not a file`, async () => {
        const err = await storage.presign('sub/').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should not end with a '/'`)
      })

      it(`should throw when path is out of scope`, async () => {
        const err = await storage.presign('../../msg').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql('Input path is out of storage scope.')
      })
    })

    describe('implementation', () => {
      it('should presign', async () => {
        const url = await storage.presign('msg')
        if (url.startsWith('file://')) return
        const { data } = await axios.get(url)
        expect(data).to.eql('hi')
      })

      it('should presign and assign an expiration time that expires', async () => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

        const url = await storage.presign('msg', { expiresIn: 1 })
        if (url.startsWith('file://')) return

        await delay(1001)

        let error
        try {
          await axios.get(url)
        } catch (err) {
          error = err
        }

        expect(error.response.status).to.eql(403)
      })
    })

    describe('output', () => {
      it('should return a string', async () => {
        const url = await storage.presign('msg')
        expect(url).to.be.a('string')
      })
    })
  })
}
