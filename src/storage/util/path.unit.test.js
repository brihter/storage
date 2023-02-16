const { Path } = require('./path')

describe('storage.util.path', () => {
  let path = Path({
    config: {
      path: '/tmp/test'
    }
  })

  describe('resolve()', () => {
    it('should resolve #1', () => {
      const resolved = path.resolve('foo/../file')
      expect(resolved).to.eql('/tmp/test/file')
    })

    it('should resolve #2', () => {
      const resolved = path.resolve('foo/../foo/file')
      expect(resolved).to.eql('/tmp/test/foo/file')
    })

    it('should resolve #3', () => {
      const resolved = path.resolve('foo1/foo2/../../file')
      expect(resolved).to.eql('/tmp/test/file')
    })

    it('should throw when path out of scope #1', () => {
      expect(path.resolve.bind(path, '../file')).to.throw(
        'Input path out of storage scope.'
      )
    })

    it('should throw when path out of scope #2', () => {
      expect(path.resolve.bind(path, 'foo/bar/../../../../file')).to.throw(
        'Input path out of storage scope.'
      )
    })
  })
})
