
# Dependencies


Storage dependencies.

## Index



Properties:

- [client](#client-any)
- [clientInstance](#clientinstance-any)



## Properties

- `client: any`
- `clientInstance: any`


#### client: any

Storage client.



Examples:

```js
const S3 = require('@aws-sdk/client-s3')

const dependencies = {
client: S3,
// ...
}
```


#### clientInstance: any

Storage client instance.



Examples:

```js
const S3 = require('@aws-sdk/client-s3')

const dependencies = {
// ...
clientInstance: new S3.S3Client({ region: 'eu-central-1' })
}
```

