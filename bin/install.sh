#!/bin/bash

parent_path=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)

cd "$parent_path/.."
npm install

cd "$parent_path/.."
cd docs/
npm install

cd "$parent_path/.."
cd ops/
npm install