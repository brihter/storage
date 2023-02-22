import { Storage as StorageCore } from '@brighter/storage'

const Storage = config => {
  return StorageCore({
    ...config,
    type: 'local'
  })
}

export { Storage }
