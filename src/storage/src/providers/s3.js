import { lookup } from 'mime-types'
import { join } from 'node:path'
import { url } from '../util/url.js'

const { url2parts } = url

const stream2Buffer = stream =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.once('end', () => resolve(Buffer.concat(chunks)))
    stream.once('error', reject)
  })

const impl = (config, dependencies) => {
  const {
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand,
    CopyObjectCommand
  } = dependencies.client

  const s3 = dependencies.clientInstance

  const getEndpoint = async () => {
    if (!s3.config.endpoint) {
      return 'https://s3.amazonaws.com'
    }

    const { hostname } = await s3.config.endpoint()
    return `https://${hostname}`
  }

  const read = async path => {
    const { Bucket, Key } = url2parts(path)

    let res
    try {
      res = await s3.send(
        new GetObjectCommand({
          Bucket,
          Key
        })
      )
    } catch (err) {
      if (err.Code !== 'NoSuchKey') {
        throw err
      }
    }

    if (!res) return
    return await stream2Buffer(res.Body)
  }

  const stat = async path => {
    const { Bucket, Key } = url2parts(path)

    const format = result => ({
      file: path,
      contentType: result.ContentType,
      etag: result.ETag.replace(/"/g, ''),
      size: result.ContentLength,
      modified: result.LastModified
    })

    let result
    try {
      result = await s3.send(
        new HeadObjectCommand({
          Bucket,
          Key
        })
      )
    } catch (err) {
      // ...
    }

    if (!result) return
    return format(result)
  }

  const write = async (path, buffer, opts) => {
    const { Bucket, Key } = url2parts(path)

    await s3.send(
      new PutObjectCommand({
        Bucket,
        Key,
        Body: buffer,
        ContentType: lookup(Key) || 'application/octet-stream'
      })
    )
  }

  const removeOne = async path => {
    const { Bucket, Key } = url2parts(path)

    await s3.send(
      new DeleteObjectCommand({
        Bucket,
        Key
      })
    )
  }

  const exists = async path => {
    const { Bucket, Key } = url2parts(path)

    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket,
        Prefix: Key,
        MaxKeys: 1
      })
    )

    return result.KeyCount > 0
  }

  const url = async path => {
    const endpoint = await getEndpoint()
    const { Bucket, Key } = url2parts(path)
    return `${endpoint}/${Bucket}/${Key}`
  }

  const listAll = async (opts = {}, items = []) => {
    const result = await s3.send(new ListObjectsV2Command(opts))

    const {
      IsTruncated,
      NextContinuationToken,
      Contents = [],
      CommonPrefixes = []
    } = result

    items.push(...Contents)
    items.push(...CommonPrefixes)

    if (!IsTruncated) {
      return items
    }

    return listAll(
      {
        ...opts,
        ContinuationToken: NextContinuationToken
      },
      items
    )
  }

  const list = async (path, opts) => {
    const { Bucket, Key } = url2parts(path)

    const items = await listAll({
      Bucket,
      Prefix: Key,
      Delimiter: !opts.recursive ? '/' : ''
    })

    return items.map(i => i.Prefix || i.Key).map(i => join(Bucket, i))
  }

  const copyOne = async (from, to) => {
    const { Bucket, Key } = url2parts(from)

    await s3.send(
      new CopyObjectCommand({
        CopySource: `${Bucket}/${Key}`,
        Bucket,
        Key: to.replace(`${Bucket}/`, '')
      })
    )
  }

  const presign = async (path, opts) => {
    const { Bucket, Key } = url2parts(path)
    const command = new GetObjectCommand({ Bucket, Key })
    return await dependencies.clientPresign.getSignedUrl(s3, command, opts)
  }

  return {
    config,
    client: s3,

    copyOne,
    read,
    stat,
    write,
    removeOne,
    exists,
    url,
    list,
    presign
  }
}

const s3provider = {
  type: 's3',
  impl
}

export { s3provider }
