
# ConfigStorage




## Index



Properties:

- [type](#type)
- [path](#path)
- [encoding](#encoding)
- [concurrency](#concurrency)



## Properties

- `type: "local" | "s3" | "r2"`
- `path: string`
- `encoding: string`
- `concurrency: number`


#### type

Storage type. For example 'local'.






#### path

Storage root path. For example '/tmp/storage'.






#### encoding

File encoding. Optional, default is `utf8`.






#### concurrency

The number of max concurrent tasks running. Optional, default is `32`.





