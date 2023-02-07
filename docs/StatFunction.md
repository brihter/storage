
# StatFunction


Returns the file information.

## Index


Constructors:

- [StatFunction(path)](#statfunctionpath-string)




## Constructors

- `StatFunction(path: string): Promise<StatFunctionOutput>`


#### StatFunction(path: string)

Parameters:

- `path: string` - File path.



Returns:

- `Promise<StatFunctionOutput>`

See: [StatFunctionOutput](StatFunctionOutput.md)

## Examples

```js
let data = await storage.stat('file')
```