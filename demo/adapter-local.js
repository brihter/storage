import { Storage } from '@brighter/storage-adapter-local'

const storage = Storage({ path: '/tmp/storage' })

const main = async () => {
  await storage.write('file', 'hello')
  const msg = await storage.read('file')
  console.log(msg)
}

main().catch(console.error)
