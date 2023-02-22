
# PreSignFunction


Creates a presigned URL that allows public access to the file.

## Index


Constructors:

- [PreSignFunction(path)](#presignfunctionpath-string)
- [PreSignFunction(path, opts)](#presignfunctionpath-string-opts-presignfunctionopts)




## Constructors

- `PreSignFunction(path: string): Promise<string>`
- `PreSignFunction(path: string, opts: PreSignFunctionOpts): Promise<string>`


#### PreSignFunction(path: string)

Parameters:

- `path: string` - File path.



Returns:

- `Promise<string>`




#### PreSignFunction(path: string, opts: PreSignFunctionOpts)

Parameters:

- `path: string` - File path.
- `opts: PreSignFunctionOpts` - Pre-sign options.

See: [PreSignFunctionOpts](PreSignFunctionOpts.md)

Returns:

- `Promise<string>`



## Examples

```js
let data = await storage.presign('file')
let data = await storage.presign('file', { expiresIn: 3600 })
```