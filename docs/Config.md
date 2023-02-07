
# Config




## Index



Properties:

- [storage](#storage-configstorage)
- [storageClient](#storageclient-object)



## Properties

- `storage: ConfigStorage`
- `storageClient: object`


#### storage: ConfigStorage

Storage configuration.

See: [ConfigStorage](ConfigStorage.md)




#### storageClient: object

Storage client configuration is required for non-local storage types.
For example `s3`, `r2`, ... The `storageClient` object is passed directly
into the underlying provider. See the official documentation for more
information.





