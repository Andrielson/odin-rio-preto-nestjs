#!/bin/sh
set -e

yarn --no-progress --silent install;

exec "$@"