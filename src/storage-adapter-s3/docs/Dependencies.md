
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






#### clientInstance: any

Storage client instance.





## Examples

```js
import S3 from '@aws-sdk/client-s3'
import S3Presign from '@aws-sdk/s3-request-presigner'

const dependencies = {
  client: S3,
  clientPresign: S3Presign,
  clientInstance: new S3.S3Client({ region: 'eu-central-1' })
}
```