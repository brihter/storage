
# Config


Storage configuration.

## Index



Properties:

- [path](#path-string)
- [encoding](#encoding-string)
- [concurrency](#concurrency-number)



## Properties

- `path: string`
- `encoding: string`
- `concurrency: number`


#### path: string

Storage root path. For example `/tmp/storage`.






#### encoding: string

File encoding. Optional, default is `utf8`.






#### concurrency: number

The number of max concurrent tasks running. Optional, default is `32`.





## Examples

```js
const config = {
  path: '/tmp/storage',
  encoding: 'utf8',
  concurrenct: 32
}
```