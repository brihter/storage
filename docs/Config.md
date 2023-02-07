
# Config




## Index



Properties:

- [storage](#storage)
- [storageClient](#storageClient)



## Properties

- `storage: ConfigStorage`
- `storageClient: object`


#### storage

Storage configuration.

See: [ConfigStorage](ConfigStorage.md)




#### storageClient

Storage client configuration is required for non-local storage types.
For example `s3`, `r2`, ... The `storageClient` object is passed directly
into the underlying provider. See the official documentation for more
information.





