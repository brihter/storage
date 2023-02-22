
# StatFunctionOutput


Stat output.

## Index



Properties:

- [file](#file-string)
- [contentType](#contenttype-string)
- [etag](#etag-string)
- [size](#size-number)
- [modified](#modified-date)
- [url](#url-string)



## Properties

- `file: String`
- `contentType: String`
- `etag: String`
- `size: Number`
- `modified: Date`
- `url: String`


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






#### url: String

File uniform resource locator (URL).





## Examples

```js
let output = {
  file: 'msg',
  contentType: 'application/octet-stream',
  etag: '49f68a5c8493ec2c0bf489821c21fc3b',
  size: 2,
  modified: 2023-02-07T09:25:30.000Z,
  url: 'https://s3.amazonaws.com/bucket/msg'
}
```