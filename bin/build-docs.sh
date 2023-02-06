#!/bin/bash

parent_path=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
cd "$parent_path/.."

cd etc/dts2md/
npm run build
npm run docs
