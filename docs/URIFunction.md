
# URIFunction


Returns the unique resource identifier (URI) of the file.

## Index


Constructors:

- [URIFunction(path)](#urifunctionpath-string)




## Constructors

- `URIFunction(path: string): Promise<string>`


#### URIFunction(path: string)

Parameters:

- `path: string` - File path.



Returns:

- `Promise<string>`



## Examples

```js
let data = await storage.uri('file')
```