describe('Storage().exists()', () => {
  let providers
  before(() => (providers = global._storage.listProviders()))
  it('run', () => providers.forEach(run))
})

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).exists()`, () => {
    let storage

    before(async () => {
      storage = global._storage.getStorage(provider)
      await storage.remove('/', { recursive: true })
      await Promise.all([
        storage.write('iam', 'ami'),
        storage.write('sub1/sub2/msg', 'hello')
      ])
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'path'`, async () => {
        const err = await storage.exists().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' missing`)
      })

      it(`should throw on incorrect 'path'`, async () => {
        const err = await storage.exists(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should be a string`)
      })

      it(`should throw on empty 'path'`, async () => {
        const err = await storage.exists('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should contain a string`)
      })
    })

    describe('implementation', () => {
      it('should return true when file exists', async () => {
        const be = await storage.exists('iam')
        expect(be).to.eql(true)
      })

      it(`should return false when file doesn't exist`, async () => {
        const be = await storage.exists('nope')
        expect(be).to.eql(false)
      })

      it('should return true when path exists #1', async () => {
        const be = await storage.exists('sub1/')
        expect(be).to.eql(true)
      })

      it('should return true when path exists #2', async () => {
        const be = await storage.exists('sub1/sub2')
        expect(be).to.eql(true)
      })

      it(`should return false when the path doesn't exist`, async () => {
        const be = await storage.exists('nope/')
        expect(be).to.eql(false)
      })
    })

    describe('output', () => {
      it('should return true on file', async () => {
        const exists = await storage.exists('iam')
        expect(exists).to.eql(true)
      })

      it('should return false on no file', async () => {
        const exists = await storage.exists('wabaduba.mp3')
        expect(exists).to.eql(false)
      })
    })
  })
}
