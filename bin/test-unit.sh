#!/bin/bash

NODE_ENV=test \
  npx mocha \
  --exit \
  --file test/bootstrap-unit.js \
  --recursive \
  --bail \
  --timeout 1000 \
  --reporter spec \
  "**/*.unit.test.js"

mocha_exit=$?
exit $mocha_exit
