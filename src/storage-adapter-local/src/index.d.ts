import type { Config, StorageInterface } from '@brighter/storage'

/**
 * Creates the storage.
 *
 * @example
 * ```js
 * import { Storage } from '@brighter/storage-adapter-local'
 *
 * const config = {
 *   path: '/tmp/storage/data'
 * }
 *
 * const storage = Storage(config)
 * ```
 */
export function Storage(config: Config): StorageInterface
