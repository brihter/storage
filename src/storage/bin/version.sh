#!/bin/bash

version_next=$1

path_current=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
path_root="$path_current/.."

cd $path_root
cat <<< $(jq '.version="'"$version_next"'"' package.json) > package.json