#!/bin/bash

path_current=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
path_root="$path_current/.."

packages=("/src/storage" "/src/storage-adapter-s3")
for path_package in "${packages[@]}"
do
  path="$path_root$path_package"
  cd $path
  rm -rf docs/
  npm run docs
done
