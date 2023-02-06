
# WriteFunction


Writes data to a file, replacing the file if it already exists.

## Index


Constructors:

- [WriteFunction(path, data)](#writefunctionpath-string-data-buffer)
- [WriteFunction(path, data, opts)](#writefunctionpath-string-data-buffer-opts-writefunctionopts)




## Constructors

- `WriteFunction(path: string, data: Buffer): Promise<void>`
- `WriteFunction(path: string, data: Buffer, opts: WriteFunctionOpts): Promise<void>`


#### WriteFunction(path: string, data: Buffer)

Parameters:

- `path: string`
- `data: Buffer`



Returns:

- `Promise<void>`




#### WriteFunction(path: string, data: Buffer, opts: WriteFunctionOpts)

Parameters:

- `path: string`
- `data: Buffer`
- `opts: WriteFunctionOpts`

See: [WriteFunctionOpts](WriteFunctionOpts.md)

Returns:

- `Promise<void>`



## Examples

```js
await storage.write('file', 'hello')
await storage.write('file', 'Ω', { encoding: 'utf8' })
await storage.write('file', Buffer.alloc(4), { encoding: 'binary' })
```