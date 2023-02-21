import { Storage } from '@brighter/storage'

const storageConfig = {
  type: 'local',
  path: '/tmp/storage'
}

const main = async () => {
  const storage = Storage(storageConfig)
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
