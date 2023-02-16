#!/bin/bash

provider=$1

CF_PROFILE=conjure-usr-ops \
AWS_PROFILE=conjure-usr-ops \
AWS_NODEJS_CONNECTION_REUSE_ENABLED=1 \
NODE_ENV=test \
npx mocha \
  --exit \
  --file test/bootstrap-integration.js \
  --recursive \
  --bail \
  --timeout 30000 \
  --reporter spec \
  "src/**/*.test.js" \
  $provider

mocha_exit=$?
exit $mocha_exit
