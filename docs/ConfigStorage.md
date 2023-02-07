
# ConfigStorage




## Index



Properties:

- [type](#type-"local"--"s3"--"r2")
- [path](#path-string)
- [encoding](#encoding-string)
- [concurrency](#concurrency-number)



## Properties

- `type: "local" | "s3" | "r2"`
- `path: string`
- `encoding: string`
- `concurrency: number`


#### type: "local" | "s3" | "r2"

Storage type. For example 'local'.






#### path: string

Storage root path. For example '/tmp/storage'.






#### encoding: string

File encoding. Optional, default is `utf8`.






#### concurrency: number

The number of max concurrent tasks running. Optional, default is `32`.





