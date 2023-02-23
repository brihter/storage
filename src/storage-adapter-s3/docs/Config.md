
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

Storage root path. For example `my-bucket/path/to/data`.






#### encoding: string

File encoding. Optional, default is `utf8`.






#### concurrency: number

The number of max concurrent tasks running. Optional, default is `32`.





## Examples

```js
const config = {
  path: 'my-bucket/path/to/data',
  encoding: 'utf8',
  concurrency: 32
}
```