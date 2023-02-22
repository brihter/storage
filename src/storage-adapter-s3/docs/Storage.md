
# Storage


Creates the storage.

## Index


Constructors:

- [Storage(config, clientConfig)](#storageconfig-config-clientconfig-any)




## Constructors

- `Storage(config: Config, clientConfig: any): StorageInterface`


#### Storage(config: Config, clientConfig: any)

Parameters:

- `config: Config`
- `clientConfig: any`



Returns:

- `StorageInterface`



## Examples

```js
import { Storage } from '@brighter/storage-adapter-s3'

const config = {
  path: 'my-bucket/path/to/data'
}

const clientConfig = {
  region: 'eu-central-1'
}

const storage = Storage(config, clientConfig)
```