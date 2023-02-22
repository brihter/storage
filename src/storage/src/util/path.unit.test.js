import { Path } from './path.js'

describe('storage.util.path', () => {
  let path = Path({
    config: {
      path: '/tmp/test'
    }
  })

  describe('scope()', () => {
    it('should resolve #1', () => {
      const resolved = path.scope('foo/../file')
      expect(resolved).to.eql('/tmp/test/file')
    })

    it('should resolve #2', () => {
      const resolved = path.scope('foo/../foo/file')
      expect(resolved).to.eql('/tmp/test/foo/file')
    })

    it('should resolve #3', () => {
      const resolved = path.scope('foo1/foo2/../../file')
      expect(resolved).to.eql('/tmp/test/file')
    })

    it('should throw when path out of scope #1', () => {
      expect(path.scope.bind(path, '../file')).to.throw('Invalid argument')
    })

    it('should throw when path out of scope #2', () => {
      expect(path.scope.bind(path, 'foo/bar/../../../../file')).to.throw(
        'Invalid argument'
      )
    })
  })
})
