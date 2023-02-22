#!/bin/bash

version_next=$1

path_current=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
path_root="$path_current/.."

# self
cat <<< $(jq '.version="'"$version_next"'"' package.json) > package.json

# packages
packages=("/src/storage" "/src/storage-adapter-s3" "/src/storage-adapter-local")
for path_package in "${packages[@]}"
do
  path="$path_root$path_package"
  cd $path
  ./bin/version.sh $version_next
done
