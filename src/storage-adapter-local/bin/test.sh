#!/bin/bash

type=$1
provider=$2

if [[ "$type" != *local* ]]; then
  exit 0
fi

path_current=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
path_root="$path_current/.."
cd $path_root

# unit tests

NODE_ENV=test \
  npx mocha \
  --exit \
  --file test/unit.js \
  --recursive \
  --bail \
  --timeout 1000 \
  --reporter spec \
  "**/*.unit.test.js"

exit_code=$?
if [ "$exit_code" -ne "0" ]; then
  exit $exit_code;
fi

# integration tests

CF_PROFILE=conjure-usr-ops \
AWS_PROFILE=conjure-usr-ops \
AWS_NODEJS_CONNECTION_REUSE_ENABLED=1 \
NODE_ENV=test \
npx mocha \
  --exit \
  --file test/integration.js \
  --recursive \
  --bail \
  --timeout 30000 \
  --reporter spec \
  "src/**/*.test.js" \
  $type \
  $provider

exit_code=$?
if [ "$exit_code" -ne "0" ]; then
  exit $exit_code;
fi

exit 0
