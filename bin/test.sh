#!/bin/bash

type=$1
provider=$2

path_current=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
path_root="$path_current/.."

packages=("/src/storage" "/src/storage-adapter-s3" "/src/storage-adapter-local")
for path_package in "${packages[@]}"
do
  path="$path_root$path_package"
  cd $path
  ./bin/test.sh $type $provider
done
