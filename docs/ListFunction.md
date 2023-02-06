
# ListFunction


Reads the contents of a `path` and returns an array of paths included in the `path`.

## Index


Constructors:

- [ListFunction(path)](#listfunctionpath-string)
- [ListFunction(path, opts)](#listfunctionpath-string-opts-listfunctionopts)




## Constructors

- `ListFunction(path: string): Promise<Array<string>>`
- `ListFunction(path: string, opts: ListFunctionOpts): Promise<Array<string>>`


#### ListFunction(path: string)

Parameters:

- `path: string`



Returns:

- `Promise<Array<string>>`




#### ListFunction(path: string, opts: ListFunctionOpts)

Parameters:

- `path: string`
- `opts: ListFunctionOpts`

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