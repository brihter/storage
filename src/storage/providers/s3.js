const mime = require('mime-types')
const { url2parts } = require('../utils/url.js')

const {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CopyObjectCommand
} = require('@aws-sdk/client-s3')

const { join } = require('path')

const stream2Buffer = stream =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.once('end', () => resolve(Buffer.concat(chunks)))
    stream.once('error', reject)
  })

const impl = config => {
  const s3 = new S3Client(config.storageClient || {})

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

    const result = await s3.send(
      new HeadObjectCommand({
        Bucket,
        Key
      })
    )

    return format(result)
  }

  const write = async (path, buffer, opts) => {
    const { Bucket, Key } = url2parts(path)

    await s3.send(
      new PutObjectCommand({
        Bucket,
        Key,
        Body: buffer,
        ContentType: mime.lookup(Key) || 'application/octet-stream'
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

  const uri = async path => {
    const { Bucket, Key } = url2parts(path)
    const region = await s3.config.region()
    return `https://${Bucket}.s3.${region}.amazonaws.com/${Key}`
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

  return {
    config: config.storage,

    copyOne,
    read,
    stat,
    write,
    removeOne,
    exists,
    uri,
    list
  }
}

module.exports = {
  type: 's3',
  impl
}
