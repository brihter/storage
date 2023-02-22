
# Config


Storage configuration.

## Index



Properties:

- [type](#type-string)
- [path](#path-string)
- [encoding](#encoding-string)
- [concurrency](#concurrency-number)



## Properties

- `type: string`
- `path: string`
- `encoding: string`
- `concurrency: number`


#### type: string

Storage type. For example `local`.






#### path: string

Storage root path. For example `/tmp/storage`.






#### encoding: string

File encoding. Optional, default is `utf8`.






#### concurrency: number

The number of max concurrent tasks running. Optional, default is `32`.





## Examples

```js
const config = {
  type: 'local',
  path: '/tmp/storage'
}
```