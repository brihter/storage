
## Documentation

### Index

Constructors

- [Storage](#constructor)

Properties

- [config](#config)

Methods

- [copy](#copy)
- [exists](#exists)
- [list](#list)
- [read](#read)
- [remove](#remove)
- [stat](#stat)
- [uri](#uri)
- [write](#write)

### Constructors

#### constructor

- `Storage(config: Config): StorageProvider`

Creates the storage provider.

Parameters:

- `config: Config`


Returns:

- `StorageProvider`


Example:

```js
const storage = Storage({
  storage: {
    type: 's3',
    path: 'my-bucket'
  },
  storageClient: {
    region: 'eu-central-1'
  }
})
```



### Properties


#### config

- `config: ConfigStorage`



### Methods

#### copy

- `copy(pathFrom: string, pathTo: string): Promise<void>`
- `copy(pathFrom: string, pathTo: string, opts: CopyFunctionOpts): Promise<void>`

Recursively copies the contents from source (`pathFrom`) to destination (`pathTo`).

Parameters:

- `pathFrom: string`
- `pathTo: string`
- `opts: CopyFunctionOpts`


Returns:

- `Promise<void>`


Example:

```js
await storage.copy('file', 'file_copy')
await storage.copy('file', 'dir/')
await storage.copy('dir/', 'dir_copy/')
await storage.copy('dir/', 'dir_copy/', { concurrency: 10 })
```



#### exists

- `exists(path: string): Promise<boolean>`

Checks if a file exists.

Parameters:

- `path: string`


Returns:

- `Promise<boolean>`


Example:

```js
let data = await storage.exists('file')
let data = await storage.exists('dir/')
```



#### list

- `list(path: string): Array<string>`
- `list(path: string, opts: ListFunctionOpts): Array<string>`

Reads the contents of a `path` and returns an array of paths included in the `path`.

Parameters:

- `path: string`
- `opts: ListFunctionOpts`


Returns:

- `Array<string>`


Example:

```js
let data = await storage.list('/')
let data = await storage.list('/', { recursive: true })
let data = await storage.list('/', { recursive: true, absolute: true })
let data = await storage.list('/', { recursive: true, absolute: true, concurrency: 10 })
```



#### read

- `read(path: string): Buffer`
- `read(path: string, opts: ReadFunctionOpts): Buffer`

Reads the contents of a file.

Parameters:

- `path: string`
- `opts: ReadFunctionOpts`


Returns:

- `Buffer`


Example:

```js
let data = await storage.read('file')
let data = await storage.read('file', { encoding: 'ascii' })
let data = await storage.read('image.bin', { encoding: 'binary' })
```



#### remove

- `remove(path: string): Promise<void>`
- `remove(path: string, opts: RemoveFunctionOpts): Promise<void>`

Removes the file.

Parameters:

- `path: string`
- `opts: RemoveFunctionOpts`


Returns:

- `Promise<void>`


Example:

```js
await storage.remove('file')
await storage.remove('dir/', { recursive: true })
await storage.remove('dir/', { recursive: true, concurrency: 10 })
```



#### stat

- `stat(path: string): StatFunctionReturn`

Returns the file information.

Parameters:

- `path: string`


Returns:

- `StatFunctionReturn`


Example:

```js
let data = await storage.stat('file')
```



#### uri

- `uri(path: string): Promise<string>`



Parameters:

- `path: string`


Returns:

- `Promise<string>`


Example:

```js
let data = await storage.uri('file')
```



#### write

- `write(path: string, data: Buffer): Promise<void>`
- `write(path: string, data: Buffer, opts: WriteFunctionOpts): Promise<void>`

Writes data to a file, replacing the file if it already exists.

Parameters:

- `path: string`
- `data: Buffer`
- `opts: WriteFunctionOpts`


Returns:

- `Promise<void>`


Example:

```js
await storage.write('file', 'hello')
await storage.write('file', 'Ω', { encoding: 'utf8' })
await storage.write('file', Buffer.alloc(4), { encoding: 'binary' })
```



