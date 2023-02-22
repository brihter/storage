
# ReadFunction


Reads the contents of a file.

## Index


Constructors:

- [ReadFunction(path)](#readfunctionpath-string)
- [ReadFunction(path, opts)](#readfunctionpath-string-opts-readfunctionopts)




## Constructors

- `ReadFunction(path: string): Promise<string | Buffer>`
- `ReadFunction(path: string, opts: ReadFunctionOpts): Promise<string | Buffer>`


#### ReadFunction(path: string)

Parameters:

- `path: string` - File path.



Returns:

- `Promise<string | Buffer>`




#### ReadFunction(path: string, opts: ReadFunctionOpts)

Parameters:

- `path: string` - File path.
- `opts: ReadFunctionOpts` - Read options.

See: [ReadFunctionOpts](ReadFunctionOpts.md)

Returns:

- `Promise<string | Buffer>`



## Examples

```js
let data = await storage.read('file')
let data = await storage.read('file', { encoding: 'ascii' })
let data = await storage.read('image.bin', { encoding: 'binary' })
```