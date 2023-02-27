const storage = {
  read: ({ path, version }) => {},
  remove: ({ path, version }) => {},
  versions: ({ path }) => {}
}

// versions interface
storage.versions({ path: 'msg' })

// read interface
storage.read({ path: 'msg' })
storage.read({ path: 'msg', version: '2' })
storage.read({ path: 'msg', version: '2', encoding: 'ascii' })

// remove interface
storage.remove({ path: 'msg' })
storage.remove({ path: 'msg', version: '2' })
