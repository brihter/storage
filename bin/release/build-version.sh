#!/bin/bash

version_next=$1

parent_path=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
cd "$parent_path/.."

cat <<< $(jq '.version="'"$version_next"'"' package.json) > package.json
cat <<< $(jq '.version="'"$version_next"'"' src/storage/package.json) > src/storage/package.json
cat <<< $(jq '.version="'"$version_next"'"' src/storage-adapter-s3/package.json) > src/storage-adapter-s3/package.json
