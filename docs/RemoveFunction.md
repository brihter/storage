
# RemoveFunction


Removes the file.

## Index


Constructors:

- [RemoveFunction(path)](#removefunctionpath-string)
- [RemoveFunction(path, opts)](#removefunctionpath-string-opts-removefunctionopts)




## Constructors

- `RemoveFunction(path: string): Promise<void>`
- `RemoveFunction(path: string, opts: RemoveFunctionOpts): Promise<void>`


#### RemoveFunction(path: string)

Parameters:

- `path: string` - File path.



Returns:

- `Promise<void>`




#### RemoveFunction(path: string, opts: RemoveFunctionOpts)

Parameters:

- `path: string` - File path.
- `opts: RemoveFunctionOpts` - Remove options.

See: [RemoveFunctionOpts](RemoveFunctionOpts.md)

Returns:

- `Promise<void>`



## Examples

```js
await storage.remove('file')
await storage.remove('dir/', { recursive: true })
await storage.remove('dir/', { recursive: true, concurrency: 10 })
```