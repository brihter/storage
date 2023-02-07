
# StatFunctionOutput


Stat output.

## Index



Properties:

- [file](#file)
- [contentType](#contentType)
- [etag](#etag)
- [size](#size)
- [modified](#modified)



## Properties

- `file: String`
- `contentType: String`
- `etag: String`
- `size: Number`
- `modified: Date`


#### file: String

File path.






#### contentType: String

File content type.






#### etag: String

File entity tag (ETag). More on ETags [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).






#### size: Number

File size in bytes.






#### modified: Date

File last modified date.





## Examples

```js
let output = {
  file: 'msg',
  contentType: 'application/octet-stream',
  etag: '49f68a5c8493ec2c0bf489821c21fc3b',
  size: 2,
  modified: 2023-02-07T09:25:30.000Z
}
```