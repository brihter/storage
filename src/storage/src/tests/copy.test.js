describe('Storage().copy()', () => {
  let providers
  before(() => (providers = global._storage.listProviders()))
  it('run', () => providers.forEach(run))
})

const run = provider => {
  describe(`Storage({ provider: '${provider}' }).copy()`, () => {
    let storage

    before(async () => {
      storage = global._storage.getStorage(provider)
      await storage.remove('/')
      await Promise.all([
        storage.write('msg.txt', 'hi'),
        storage.write('sub/one', 'hi'),
        storage.write('sub/sub/one', 'hi')
      ])
    })

    after(async () => {
      await storage.remove('/', { recursive: true })
    })

    describe('input', () => {
      it(`should throw on missing 'pathFrom'`, async () => {
        const err = await storage.copy().catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'pathFrom' missing`)
      })

      it(`should throw on incorrect 'pathFrom'`, async () => {
        const err = await storage.copy(1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'pathFrom' should be a string`)
      })

      it(`should throw on empty 'pathFrom'`, async () => {
        const err = await storage.copy('').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'pathFrom' should contain a string`)
      })

      it(`should throw on missing 'pathTo'`, async () => {
        const err = await storage.copy('dir1/').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'pathTo' missing`)
      })

      it(`should throw on incorrect 'pathTo'`, async () => {
        const err = await storage.copy('dir1/', 1).catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'pathTo' should be a string`)
      })

      it(`should throw on empty 'pathTo'`, async () => {
        const err = await storage.copy('dir1/', '').catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql(`'pathTo' should contain a string`)
      })

      it(`should throw when pathFrom is out of scope`, async () => {
        const err = await storage
          .copy('../../msg.txt', 'msg_copy.txt')
          .catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql('Input path is out of storage scope.')
      })

      it(`should throw when pathTo is out of scope`, async () => {
        const err = await storage
          .copy('msg.txt', '../../msg_copy.txt')
          .catch(err => err)

        expect(err).to.be.an('error')
        expect(err.message).to.eql('Invalid argument')
        expect(err.cause).to.eql('Input path is out of storage scope.')
      })
    })

    describe('implementation', () => {
      it(`should throw when 'pathFrom' doesn't exist`, async () => {
        const err = await storage.copy('nope/', 'copy/').catch(err => err)
        expect(err).to.be.an('error')
        expect(err.message).to.eql(`'pathFrom' doesn't exist`)
      })

      it(`should throw when 'pathFrom' is a directory and 'pathTo' a file`, async () => {
        const err = await storage.copy('nope/', 'msg.txt').catch(err => err)
        expect(err).to.be.an('error')
        expect(err.message).to.eql(
          `Unable to copy, 'pathFrom' is a directory and 'pathTo' a file`
        )
      })

      it('should copy, file to file', async () => {
        await storage.copy('msg.txt', 'msg_copy.txt')
        const result = await storage.read('msg_copy.txt')
        expect(result).to.eql('hi')
      })

      it('should resolve and copy, file to file #1', async () => {
        await storage.copy('foo/../msg.txt', 'msg_copy1.txt')
        const result = await storage.read('msg_copy1.txt')
        expect(result).to.eql('hi')
      })

      it('should resolve and copy, file to file #2', async () => {
        await storage.copy('msg.txt', 'foo/../msg_copy2.txt')
        const result = await storage.read('msg_copy2.txt')
        expect(result).to.eql('hi')
      })

      it('should copy, file to file inside a subfolder', async () => {
        await storage.copy('msg.txt', 'copy/msg_copy.txt')
        const result = await storage.read('copy/msg_copy.txt')
        expect(result).to.eql('hi')
      })

      it('should copy, file to folder #1', async () => {
        await storage.copy('msg.txt', 'copy/')
        const result = await storage.read('copy/msg.txt')
        expect(result).to.eql('hi')
      })

      it('should copy, file to folder #2', async () => {
        await storage.copy('sub/one', 'copy-folder/nested/')
        const result = await storage.read('copy-folder/nested/one')
        expect(result).to.eql('hi')
      })

      it('should copy, folder to folder #1', async () => {
        await storage.copy('sub/', 'sub-copy/')
        const list1 = await storage.list('sub/', { recursive: true })
        const list2 = await storage.list('sub-copy/', { recursive: true })
        expect(list1).to.eql(list2)
      })

      it('should copy, folder to folder #2', async () => {
        await storage.copy('sub/', 'sub-copy/nested/')
        const list1 = await storage.list('sub/', { recursive: true })
        const list2 = await storage.list('sub-copy/nested/', { recursive: true })
        expect(list1).to.eql(list2)
      })
    })

    describe('output', () => {
      it('should return undefined', async () => {
        const result = await storage.copy('msg.txt', 'msg_copy.txt')
        expect(result).to.be.undefined
      })
    })
  })
}
