import type { Config, StorageInterface } from '@brighter/storage'

/**
 * Creates the storage.
 *
 * @example
 * ```js
 * import { Storage } from '@brighter/storage-adapter-s3'
 *
 * const config = {
 *   path: 'my-bucket/path/to/data'
 * }
 *
 * const clientConfig = {
 *   region: 'eu-central-1'
 * }
 *
 * const storage = Storage(config, clientConfig)
 * ```
 */
export function Storage(config: Config, clientConfig: any): StorageInterface
