
# CopyFunction


Recursively copies the contents from source to destination.

## Index


Constructors:

- [CopyFunction(pathFrom, pathTo)](#copyfunctionpathfrom-string-pathto-string)
- [CopyFunction(pathFrom, pathTo, opts)](#copyfunctionpathfrom-string-pathto-string-opts-copyfunctionopts)




## Constructors

- `CopyFunction(pathFrom: string, pathTo: string): Promise<void>`
- `CopyFunction(pathFrom: string, pathTo: string, opts: CopyFunctionOpts): Promise<void>`


#### CopyFunction(pathFrom: string, pathTo: string)

Parameters:

- `pathFrom: string`
- `pathTo: string`



Returns:

- `Promise<void>`




#### CopyFunction(pathFrom: string, pathTo: string, opts: CopyFunctionOpts)

Parameters:

- `pathFrom: string`
- `pathTo: string`
- `opts: CopyFunctionOpts`

See: [CopyFunctionOpts](CopyFunctionOpts.md)

Returns:

- `Promise<void>`



## Examples

```js
await storage.copy('file', 'file_copy')
await storage.copy('file', 'dir/')
await storage.copy('dir/', 'dir_copy/')
await storage.copy('dir/', 'dir_copy/', { concurrency: 10 })
```