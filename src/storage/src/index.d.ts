/**
 * Storage configuration.
 *
 * @example
 * ```js
 * const config = {
 *   type: 'local',
 *   path: '/tmp/storage'
 * }
 * ```
 */
type Config = {
  /**
   * Storage type. For example `local`.
   */
  type: string

  /**
   * Storage root path. For example `/tmp/storage`.
   */
  path: string

  /**
   * File encoding. Optional, default is `utf8`. See [list of supported encodings](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings).
   */
  encoding?: string

  /**
   * The number of max concurrent tasks running. Optional, default is `32`.
   */
  concurrency?: number
}

/**
 * Storage dependencies.
 *
 * @example
 * ```js
 * import S3 from '@aws-sdk/client-s3'
 * import S3Presign from '@aws-sdk/s3-request-presigner'
 *
 * const dependencies = {
 *   client: S3,
 *   clientPresign: S3Presign,
 *   clientInstance: new S3.S3Client({ region: 'eu-central-1' })
 * }
 * ```
 */
type Dependencies = {
  /**
   * Storage client.
   */
  client: any

  /**
   * Storage client instance.
   */
  clientInstance: any
}

/**
 * Copy options.
 */
type CopyFunctionOpts = {
  /**
   * The number of max concurrent tasks running. Optional, default is `32`.
   */
  concurrency?: number
}

/**
 * Recursively copies the contents from source to destination.
 *
 * @example
 * ```js
 * await storage.copy('file', 'file_copy')
 * await storage.copy('file', 'dir/')
 * await storage.copy('dir/', 'dir_copy/')
 * await storage.copy('dir/', 'dir_copy/', { concurrency: 10 })
 * ```
 */
type CopyFunction = {
  /**
   * @param pathFrom Path to copy from, the source path.
   * @param pathTo Path to copy to, the target path.
   */
  (pathFrom: string, pathTo: string): Promise<void>

  /**
   * @param pathFrom Path to copy from, the source path.
   * @param pathTo Path to copy to, the target path.
   * @param opts Copy options.
   */
  (pathFrom: string, pathTo: string, opts: CopyFunctionOpts): Promise<void>
}

/**
 * Checks if a file exists.
 *
 * @example
 * ```js
 * let data = await storage.exists('file')
 * let data = await storage.exists('dir/')
 * ```
 */
type ExistsFunction = {
  /**
   * @param path File path.
   */
  (path: string): Promise<boolean>
}

/**
 * List options.
 */
type ListFunctionOpts = {
  /**
   * Scan the input path recursively when `true`. Optional, default is `false`.
   */
  recursive?: boolean

  /**
   * Return absolute paths (relative to the configured storage path) when `true`. Optional, default is `false`.
   */
  absolute?: boolean

  /**
   * The number of max concurrent tasks running. Optional, default is `32`.
   */
  concurrency?: number
}

/**
 * Reads the contents of a directory.
 *
 * @example
 * ```js
 * let data = await storage.list('/')
 * let data = await storage.list('/', { recursive: true })
 * let data = await storage.list('/', { recursive: true, absolute: true })
 * let data = await storage.list('/', { recursive: true, absolute: true, concurrency: 10 })
 * ```
 */
type ListFunction = {
  /**
   * @param path Directory path.
   */
  (path: string): Promise<Array<string>>

  /**
   * @param path Directory path.
   * @param opts List options.
   */
  (path: string, opts: ListFunctionOpts): Promise<Array<string>>
}

/**
 * Pre-sign options.
 */
type PreSignFunctionOpts = {
  /**
   * Expiry time in seconds. Optional, default is `3600`.
   */
  expiresIn?: number
}

/**
 * Creates a presigned URL that allows public access to the file.
 *
 * @example
 * ```js
 * let data = await storage.presign('file')
 * let data = await storage.presign('file', { expiresIn: 3600 })
 * ```
 */
type PreSignFunction = {
  /**
   * @param path File path.
   */
  (path: string): Promise<string>

  /**
   * @param path File path.
   * @param opts Pre-sign options.
   */
  (path: string, opts: PreSignFunctionOpts): Promise<string>
}

/**
 * Read options.
 */
type ReadFunctionOpts = {
  /**
   * File encoding. Optional, default is `utf8`. See [list of supported encodings](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings).
   */
  encoding?: string
}

/**
 * Reads the contents of a file.
 *
 * @example
 * ```js
 * let data = await storage.read('file')
 * let data = await storage.read('file', { encoding: 'ascii' })
 * let data = await storage.read('image.bin', { encoding: 'binary' })
 * ```
 */
type ReadFunction = {
  /**
   * @param path File path.
   */
  (path: string): Promise<string | Buffer>

  /**
   * @param path File path.
   * @param opts Read options.
   */
  (path: string, opts: ReadFunctionOpts): Promise<string | Buffer>
}

/**
 * Remove options.
 */
type RemoveFunctionOpts = {
  /**
   * Scan the input path recursively when `true`. Optional, default is `false`.
   */
  recursive?: boolean

  /**
   * The number of max concurrent tasks running. Optional, default is `32`.
   */
  concurrency?: number
}

/**
 * Removes the file.
 *
 * @example
 * ```js
 * await storage.remove('file')
 * await storage.remove('dir/', { recursive: true })
 * await storage.remove('dir/', { recursive: true, concurrency: 10 })
 * ```
 */
type RemoveFunction = {
  /**
   * @param path File path.
   */
  (path: string): Promise<void>

  /**
   * @param path File path.
   * @param opts Remove options.
   */
  (path: string, opts: RemoveFunctionOpts): Promise<void>
}

/**
 * Stat output.
 *
 * @example
 * ```js
 * let output = {
 *   file: 'msg',
 *   contentType: 'application/octet-stream',
 *   etag: '49f68a5c8493ec2c0bf489821c21fc3b',
 *   size: 2,
 *   modified: 2023-02-07T09:25:30.000Z,
 *   url: 'https://s3.amazonaws.com/bucket/msg'
 * }
 * ```
 */
type StatFunctionOutput = {
  /**
   * File path.
   */
  file: String

  /**
   * File content type.
   */
  contentType: String

  /**
   * File entity tag (ETag). More on ETags [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).
   */
  etag: String

  /**
   * File size in bytes.
   */
  size: Number

  /**
   * File last modified date.
   */
  modified: Date

  /**
   * File uniform resource locator (URL).
   */
  url: String
}

/**
 * Returns the file information.
 *
 * @example
 * ```js
 * let data = await storage.stat('file')
 * ```
 */
type StatFunction = {
  /**
   * @param path File path.
   */
  (path: string): Promise<StatFunctionOutput>
}

/**
 * Write options.
 */
type WriteFunctionOpts = {
  /**
   * File encoding. Optional, default is `utf8`. See [list of supported encodings](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings).
   */
  encoding?: string
}

/**
 * Writes data to a file, replacing the file if it already exists.
 *
 * @example
 * ```js
 * await storage.write('file', 'hello')
 * await storage.write('file', 'Ω', { encoding: 'utf8' })
 * await storage.write('file', Buffer.alloc(4), { encoding: 'binary' })
 * ```
 */
type WriteFunction = {
  /**
   * @param path File path.
   * @param data File contents.
   */
  (path: string, data: string | Buffer): Promise<void>

  /**
   * @param path File path.
   * @param data File contents.
   * @param opts Write options.
   */
  (path: string, data: string | Buffer, opts: WriteFunctionOpts): Promise<void>
}

/**
 * Storage interface returned by the `Storage()` function.
 *
 * @example
 * ```js
 * import S3 from '@aws-sdk/client-s3'
 * import S3Presign from '@aws-sdk/s3-request-presigner'
 *
 * const config = {
 *   type: 's3',
 *   path: 'bucket-3d8e8dd/path/to/data'
 * }
 *
 * const dependencies = {
 *   client: S3,
 *   clientPresign: S3Presign,
 *   clientInstance: new S3.S3Client({ region: 'eu-central-1' })
 * }
 *
 * const storage = Storage(config, dependencies)
 * ```
 */
type StorageInterface = {
  config: Config

  /**
   * Recursively copies the contents from source to destination.
   */
  copy: CopyFunction

  /**
   * Checks if a file exists.
   */
  exists: ExistsFunction

  /**
   * Reads the contents of a directory.
   */
  list: ListFunction

  /**
   * Creates a presigned URL that allows public access to the file.
   */
  presign: PreSignFunction

  /**
   * Reads the contents of a file.
   */
  read: ReadFunction

  /**
   * Removes the file.
   */
  remove: RemoveFunction

  /**
   * Returns the file information.
   */
  stat: StatFunction

  /**
   * Writes data to a file, replacing the file if it already exists.
   */
  write: WriteFunction
}

/**
 * Creates the storage.
 *
 * @example
 * ```js
 * import S3 from '@aws-sdk/client-s3'
 * import S3Presign from '@aws-sdk/s3-request-presigner'
 *
 * const config = {
 *   type: 's3',
 *   path: 'bucket-3d8e8dd/path/to/data'
 * }
 *
 * const dependencies = {
 *   client: S3,
 *   clientPresign: S3Presign,
 *   clientInstance: new S3.S3Client({ region: 'eu-central-1' })
 * }
 *
 * const storage = Storage(config, dependencies)
 * ```
 */
export function Storage(
  config: Config,
  dependencies: Dependencies
): StorageInterface
