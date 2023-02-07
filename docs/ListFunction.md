
# ListFunction


Reads the contents of a directory.

## Index


Constructors:

- [ListFunction(path)](#listfunctionpath-string)
- [ListFunction(path, opts)](#listfunctionpath-string-opts-listfunctionopts)




## Constructors

- `ListFunction(path: string): Promise<Array<string>>`
- `ListFunction(path: string, opts: ListFunctionOpts): Promise<Array<string>>`


#### ListFunction(path: string)

Parameters:

- `path: string` - Directory path.



Returns:

- `Promise<Array<string>>`




#### ListFunction(path: string, opts: ListFunctionOpts)

Parameters:

- `path: string` - Directory path.
- `opts: ListFunctionOpts` - List options.

See: [ListFunctionOpts](ListFunctionOpts.md)

Returns:

- `Promise<Array<string>>`



## Examples

```js
let data = await storage.list('/')
let data = await storage.list('/', { recursive: true })
let data = await storage.list('/', { recursive: true, absolute: true })
let data = await storage.list('/', { recursive: true, absolute: true, concurrency: 10 })
```