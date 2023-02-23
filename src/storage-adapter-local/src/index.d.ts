import type { StorageInterface } from '@brighter/storage'

/**
 * Storage configuration.
 *
 * @example
 * ```js
 * const config = {
 *   path: '/tmp/storage',
 *   encoding: 'utf8',
 *   concurrenct: 32
 * }
 * ```
 */
type Config = {
  /**
   * Storage root path. For example `/tmp/storage`.
   */
  path: string

  /**
   * File encoding. Optional, default is `utf8`.
   */
  encoding?: string

  /**
   * The number of max concurrent tasks running. Optional, default is `32`.
   */
  concurrency?: number
}

/**
 * Creates the storage.
 *
 * @example
 * ```js
 * const config = {
 *   path: '/tmp/storage'
 * }
 *
 * const storage = Storage({
 *   path: '/tmp/storage'
 * })
 * ```
 */
export function Storage(config: Config): StorageInterface
