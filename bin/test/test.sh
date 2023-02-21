#!/bin/bash

./bin/test-unit.sh
exit_code=$?

if [ "$exit_code" -ne "0" ]; then
  exit $exit_code;
fi

./bin/test-integration.sh
exit_code=$?

if [ "$exit_code" -ne "0" ]; then
  exit $exit_code;
fi
