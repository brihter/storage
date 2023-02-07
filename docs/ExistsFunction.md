
# ExistsFunction


Checks if a file exists.

## Index


Constructors:

- [ExistsFunction(path)](#existsfunctionpath-string)




## Constructors

- `ExistsFunction(path: string): Promise<boolean>`


#### ExistsFunction(path: string)

Parameters:

- `path: string` - File path.



Returns:

- `Promise<boolean>`



## Examples

```js
let data = await storage.exists('file')
let data = await storage.exists('dir/')
```