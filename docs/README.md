
# Storage


Creates the storage provider.

## Index


Constructors:

- [Storage(config)](#storageconfig-config)




## Constructors

- `Storage(config: Config): StorageInterface`


#### Storage(config: Config)

Parameters:

- `config: Config`

See: [Config](Config.md)

Returns:

- `StorageInterface`

See: [StorageInterface](StorageInterface.md)

## Examples

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

# StorageInterface




## Index



Properties:

- [config](#config)


Methods:

- [copy](#Methods)
- [exists](#Methods)
- [list](#Methods)
- [read](#Methods)
- [remove](#Methods)
- [stat](#Methods)
- [uri](#Methods)
- [write](#Methods)



## Properties

- `config: ConfigStorage`


#### config: ConfigStorage



See: [ConfigStorage](ConfigStorage.md)




## Methods


#### CopyFunction

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



#### Examples

```js
await storage.copy('file', 'file_copy')
await storage.copy('file', 'dir/')
await storage.copy('dir/', 'dir_copy/')
await storage.copy('dir/', 'dir_copy/', { concurrency: 10 })
```

#### ExistsFunction

- `ExistsFunction(path: string): Promise<boolean>`


#### ExistsFunction(path: string)

Parameters:

- `path: string`



Returns:

- `Promise<boolean>`



#### Examples

```js
let data = await storage.exists('file')
let data = await storage.exists('dir/')
```

#### ListFunction

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



#### Examples

```js
let data = await storage.list('/')
let data = await storage.list('/', { recursive: true })
let data = await storage.list('/', { recursive: true, absolute: true })
let data = await storage.list('/', { recursive: true, absolute: true, concurrency: 10 })
```

#### ReadFunction

- `ReadFunction(path: string): Promise<string | Buffer>`
- `ReadFunction(path: string, opts: ReadFunctionOpts): Promise<string | Buffer>`


#### ReadFunction(path: string)

Parameters:

- `path: string`



Returns:

- `Promise<string | Buffer>`




#### ReadFunction(path: string, opts: ReadFunctionOpts)

Parameters:

- `path: string`
- `opts: ReadFunctionOpts`

See: [ReadFunctionOpts](ReadFunctionOpts.md)

Returns:

- `Promise<string | Buffer>`



#### Examples

```js
let data = await storage.read('file')
let data = await storage.read('file', { encoding: 'ascii' })
let data = await storage.read('image.bin', { encoding: 'binary' })
```

#### RemoveFunction

- `RemoveFunction(path: string): Promise<void>`
- `RemoveFunction(path: string, opts: RemoveFunctionOpts): Promise<void>`


#### RemoveFunction(path: string)

Parameters:

- `path: string`



Returns:

- `Promise<void>`




#### RemoveFunction(path: string, opts: RemoveFunctionOpts)

Parameters:

- `path: string`
- `opts: RemoveFunctionOpts`

See: [RemoveFunctionOpts](RemoveFunctionOpts.md)

Returns:

- `Promise<void>`



#### Examples

```js
await storage.remove('file')
await storage.remove('dir/', { recursive: true })
await storage.remove('dir/', { recursive: true, concurrency: 10 })
```

#### StatFunction

- `StatFunction(path: string): Promise<StatFunctionOutput>`


#### StatFunction(path: string)

Parameters:

- `path: string`



Returns:

- `Promise<StatFunctionOutput>`

See: [StatFunctionOutput](StatFunctionOutput.md)

#### Examples

```js
let data = await storage.stat('file')
```

#### URIFunction

- `URIFunction(path: string): Promise<string>`


#### URIFunction(path: string)

Parameters:

- `path: string`



Returns:

- `Promise<string>`



#### Examples

```js
let data = await storage.uri('file')
```

#### WriteFunction

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



#### Examples

```js
await storage.write('file', 'hello')
await storage.write('file', 'Ω', { encoding: 'utf8' })
await storage.write('file', Buffer.alloc(4), { encoding: 'binary' })
```
