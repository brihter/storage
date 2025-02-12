import aws from '@pulumi/aws'

const bucketAWS = new aws.s3.Bucket('conjure-storage-test')

exports.bucket_aws = bucketAWS.id

exports.bucket_cf = 'conjure-storage-test-4x1a7ff'

exports.bucket_hetzner = 'conjure-storage-test-1a2f2cc'
