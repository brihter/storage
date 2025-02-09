import { Storage } from '@brighter/storage-adapter-s3'

const config = { path: 'my-bucket' }
const configClient = { region: 'eu-central-1' }

const storage = Storage(config, configClient)

const main = async () => {
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
