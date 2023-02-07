
# StorageInterface


Storage interface.

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

- `copy: CopyFunction`
- `exists: ExistsFunction`
- `list: ListFunction`
- `read: ReadFunction`
- `remove: RemoveFunction`
- `stat: StatFunction`
- `uri: URIFunction`
- `write: WriteFunction`


#### copy: CopyFunction



See: [CopyFunction](CopyFunction.md)




#### exists: ExistsFunction



See: [ExistsFunction](ExistsFunction.md)




#### list: ListFunction



See: [ListFunction](ListFunction.md)




#### read: ReadFunction



See: [ReadFunction](ReadFunction.md)




#### remove: RemoveFunction



See: [RemoveFunction](RemoveFunction.md)




#### stat: StatFunction



See: [StatFunction](StatFunction.md)




#### uri: URIFunction

Returns the unique resource identifier (URI) of the file.

See: [URIFunction](URIFunction.md)

Examples:

```js
let data = await storage.uri('file')
```


#### write: WriteFunction

Writes data to a file, replacing the file if it already exists.

See: [WriteFunction](WriteFunction.md)

Examples:

```js
await storage.write('file', 'hello')
await storage.write('file', 'Ω', { encoding: 'utf8' })
await storage.write('file', Buffer.alloc(4), { encoding: 'binary' })
```

