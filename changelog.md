# Changelog

## v1.5.8

- CI pipeline test parallelization.

This release reworks the CI pipeline, so that adding and testing against new infrastructure providers is easier and faster. This is a maintenance release.

## v1.5.7

- Improved documentation.

This is a maintenance release.

## v1.5.6

- Updated dependencies for `@brighter/storage-adapter-local`.
- Updated dependencies for `@brighter/storage-adapter-s3`.
- Updated dependencies for `@brighter/storage`.
- Improved documentation.

This is a maintenance release.

## v1.5.5

- Improved documentation.

This is a maintenance release.

## v1.5.4

- Improved documentation.

This is a maintenance release.

## v1.5.3

- Improved documentation.

This is a maintenance release.

## v1.5.2

- Improved documentation for `@brighter/storage-adapter-local`.
- Improved documentation for `@brighter/storage-adapter-s3`.
- Improved project README.

This is a maintenance release.

## v1.5.1

- Automatically publish the `@brighter/storage-adapter-local` storage adapter to NPM.

This is a maintenance release.

## v1.5.0

- Implemented the `@brighter/storage-adapter-local` storage adapter.

## v1.4.2

- Fixed dependency syncronization.

## v1.4.1

- Automatic update of `@brighter/storage` dependencies in `@brighter/storage-adapter-s3` to the current version.

## v1.4.0

- Restructured the project into separate packages.
- Implemented the `@brighter/storage-adapter-s3` storage adapter.

This release introduces adapters that come prebundled with required storage dependecies. This removes the complexity of manually injecting the dependencies.

## v1.3.0

- Converted to an ECMAScript module.

This release converts the library to an ECMAScript module.

## v1.2.0

- Added presigned URLs.

This release adds support for [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html).

## v1.1.0

- Added support for relative input paths.
- Added support for unit testing.

This release adds support for relative input paths. Storage now resolves the actual input path and throw an error when the resolved path is out of storage scope.

## v1.0.4

- Implemented promise throttling.
- Removed the `bluebird` dependency.

This release implements promise throttling and removes the `bluebird` dependency. This further reduces the package size.

## v1.0.3

- Tidying up.
- Added scoped utils.
- Removed `uri` from the `stat()` function output.
- Removed obsolete documentation bits.

## v1.0.2

- Removed "examples/", "readme.md" and "changelog.md" from the published package.

## v1.0.1

- Added the ability to isolate a provider when running tests.
- Added the "API overview" section to the documentation.
- Added the "Testing" section to the documentation.
- Added the "Releasing" section to the documentation.

## v1.0.0

- Added examples.
- Updated the documentation.

## v1.0.0-beta.10

- Detached the storage client from the library.
- Updated type definitions.
- Updated documentation.

## v1.0.0-beta.9

- Removed the `uri()` function from the storage interface.
- Added URI information to `stat()`.
- Added URL information to `stat()`.

## v1.0.0-beta.8

- Drop multiple node versions from the CI's release workflow.
- Drop tests from the CI's release workflow.

## v1.0.0-beta.7

- Added a public roadmap.
- Property types added to property headings in the documentation.
- Added missing type and property descriptions in the documentation.
- A more clear documentation index.
