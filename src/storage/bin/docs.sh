#!/bin/bash

path_current=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
path_root="$path_current/.."

cd $path_root
node ../dts2md/dist/index.js --root=src/index.d.ts --output=docs
