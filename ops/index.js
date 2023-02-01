const aws = require('@pulumi/aws')

const bucketAWS = new aws.s3.Bucket('conjure-storage-test')

exports.bucket_aws = bucketAWS.id

// NOTE
// hardcoded because there's no way of creating a cloudflare bucket
// through pulumi and i was too lazy to do it programayically
exports.bucket_cf = 'conjure-storage-test-4x1a7ff'