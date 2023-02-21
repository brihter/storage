#!/bin/bash

path_current=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
path_root="$path_current/.."

packages=("/src/dts2md")
for path_package in "${packages[@]}"
do
  path="$path_root$path_package"
  cd $path
  pwd
  npm run build
done
