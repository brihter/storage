describe.only('Storage().presign()', () => {
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
      it('should run', () => {
        // ...
      })
    })

    describe('implementation', () => {
      it('should presign', async () => {
        const url = await storage.presign('msg')
        // ...
      })
    })

    describe('output', () => {
      it('should run', () => {
        // ...
      })
    })
  })
}
