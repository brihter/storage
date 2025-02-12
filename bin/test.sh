#!/bin/bash

type=$1
provider=$2

path_current=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
path_root="$path_current/.."
exit_code=0

packages=("/src/storage" "/src/storage-adapter-s3" "/src/storage-adapter-local")
for path_package in "${packages[@]}"; do
 cd "$path_root$path_package"
 ./bin/test.sh $type $provider || exit_code=$?
done

exit $exit_code
