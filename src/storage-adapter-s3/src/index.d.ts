import type { S3ClientConfig } from '@aws-sdk/client-s3'
import type { StorageInterface } from '@brighter/storage'

/**
 * Storage configuration.
 *
 * @example
 * ```js
 * const config = {
 *   path: 'my-bucket/path/to/data',
 *   encoding: 'utf8',
 *   concurrency: 32
 * }
 * ```
 */
type Config = {
  /**
   * Storage root path. For example `my-bucket/path/to/data`.
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
 * @param config Storage configuration.
 * @param configClient Storage client configuration. See: [S3ClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html).
 *
 * @example
 * ```js
 * const config = {
 *   path: 'my-bucket/path/to/data'
 * }
 *
 * const configClient = {
 *   region: 'eu-central-1'
 * }
 *
 * const storage = Storage(config, configClient)
 * ```
 */
export function Storage(
  config: Config,
  configClient: S3ClientConfig
): StorageInterface
