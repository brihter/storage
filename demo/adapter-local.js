import { Storage } from '@brighter/storage-adapter-local'

const storage = Storage({ path: '/tmp/storage' })

const main = async () => {
  await storage.write('msg.txt', 'hello')
  const msg = await storage.read('msg.txt')
  console.log(msg)
}

main().catch(console.error)
