#!/bin/bash

parent_path=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
version_next=$1

cd "$parent_path/.."
cat <<< $(jq '.version="'"$version_next"'"' package.json) > package.json
