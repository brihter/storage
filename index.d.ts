type ConfigStorage = {
  /**
   * Storage type. For example 'local'.
   */
  type: 'local' | 's3' | 'r2'

  /**
   * Storage root path. For example '/tmp/storage'.
   */
  path: string

  /**
   * File encoding. Default is `utf8`.
   * @default 'utf8'
   */
  encoding?: string

  /**
   * The number of concurrent tasks running. Default is `32`.
   * @default 32
   */
  concurrency?: number
}

type Config = {
  /**
   * Storage configuration.
   */
  storage: ConfigStorage

  /**
   * Storage client configuration is required for non-local storage types.
   * For example `s3`, `r2`, ... The `storageClient` object is passed directly
   * into the underlying provider. See the official documentation for more
   * information.
   */
  storageClient?: object
}

type CopyFunctionOpts = {
  /**
   * The number of concurrent tasks running. Default is `32`.
   * @default 32
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
  (pathFrom: string, pathTo: string): Promise<void>
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
  (path: string): Promise<boolean>
}

type ListFunctionOpts = {
  /**
   * Scan the input path recursively when `recursive` is `true`. Default is `false`.
   * @default false
   */
  recursive?: boolean

  /**
   * Return absolute paths (relative to the configured storage path) when `absolute` is `true`. Default is `false`.
   * @default false
   */
  absolute?: boolean

  /**
   * The number of concurrent tasks running. Default is `32`.
   * @default 32
   */
  concurrency?: number
}

/**
 * Reads the contents of a `path` and returns an array of paths included in the `path`.
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
  (path: string): Promise<Array<string>>
  (path: string, opts: ListFunctionOpts): Promise<Array<string>>
}

type ReadFunctionOpts = {
  /**
   * File encoding. Default is `utf8`.
   * @default 'utf8'
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
  (path: string): Promise<string | Buffer>
  (path: string, opts: ReadFunctionOpts): Promise<string | Buffer>
}

type RemoveFunctionOpts = {
  /**
   * Scan the input path recursively when `recursive` is `true`. Default is `false`.
   * @default false
   */
  recursive?: boolean

  /**
   * The number of concurrent tasks running. Default is `32`.
   * @default 32
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
  (path: string): Promise<void>
  (path: string, opts: RemoveFunctionOpts): Promise<void>
}

type StatFunctionOutput = {
  file: String
  contentType: String
  etag: String
  size: Number
  modified: Date
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
  (path: string): Promise<StatFunctionOutput>
}

/**
 * Write options.
 */
type WriteFunctionOpts = {
  /**
   * File encoding. Default is `utf8`.
   * @default 'utf8'
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
  (path: string, data: string | Buffer): Promise<void>
  (path: string, data: string | Buffer, opts: WriteFunctionOpts): Promise<void>
}

/**
 * @example
 * ```js
 * let data = await storage.uri('file')
 * ```
 */
type URIFunction = {
  (path: string): Promise<string>
}

type StorageInterface = {
  readonly config: ConfigStorage

  copy: CopyFunction
  exists: ExistsFunction
  list: ListFunction
  read: ReadFunction
  remove: RemoveFunction
  stat: StatFunction
  uri: URIFunction
  write: WriteFunction
}

/**
 * Creates the storage provider.
 *
 * @example
 * ```js
 * const storage = Storage({
 *   storage: {
 *     type: 's3',
 *     path: 'my-bucket'
 *   },
 *   storageClient: {
 *     region: 'eu-central-1'
 *   }
 * })
 * ```
 */
export function Storage(config: Config): StorageInterface
