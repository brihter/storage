describe('Storage().list()', () => {
  let providers
  before(() => (providers = global._storage.listProviders()))
  it('run', () => providers.forEach(run))
})

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).list()`, () => {
    let storage

    before(async () => {
      storage = global._storage.getStorage(provider)
      await storage.remove('/', { recursive: true })
      await Promise.all([
        storage.write('msg', 'read'),
        storage.write('sub/msg', 'readsub'),
        storage.write('sub/sub/msg', 'readsubsub')
      ])
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'path'`, async () => {
        const err = await storage.list().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' missing`)
      })

      it(`should throw on incorrect 'path'`, async () => {
        const err = await storage.list(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should be a string`)
      })

      it(`should throw on empty 'path'`, async () => {
        const err = await storage.list('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'path' should contain a string`)
      })
    })

    describe('implementation', () => {
      it('should list items and prefixes', async () => {
        const items = await storage.list('/')
        expect(items).to.have.members(['msg', 'sub/'])
      })

      it('should list items recursively and omit prefixes #1', async () => {
        const items = await storage.list('/', { recursive: true })
        expect(items).to.have.members(['msg', 'sub/msg', 'sub/sub/msg'])
      })

      it('should list items recursively and omit prefixes #2', async () => {
        const items = await storage.list('sub/', { recursive: true })
        expect(items).to.have.members(['msg', 'sub/msg'])
      })

      it('should list items and prefixes and return absolute paths #1', async () => {
        const items = await storage.list('sub/', { absolute: true })
        expect(items).to.have.members(['/sub/msg', '/sub/sub/'])
      })

      it('should list items and omit prefixes and return absolute paths #2', async () => {
        const items = await storage.list('sub/', {
          absolute: true,
          recursive: true
        })

        expect(items).to.have.members(['/sub/msg', '/sub/sub/msg'])
      })
    })

    describe('output', () => {
      it(`should return an array`, async () => {
        const items = await storage.list('/')
        expect(items instanceof Array).to.eql(true)
      })

      it(`should return an array on non-existing dirs`, async () => {
        const items = await storage.list('nope1/')
        expect(items instanceof Array).to.eql(true)
      })
    })
  })
}
