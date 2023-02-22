import { Storage } from '@brighter/storage-adapter-local'

const config = {
  path: 'my-bucket'
}

const main = async () => {
  const storage = Storage(config)
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
