#!/usr/bin/env bash

cd "$(dirname -- "${BASH_SOURCE[0]}")"
killall -9 domshot
go build -o domshot
tee -a /tmp/stdin | ./domshot 2>(tee -a /tmp/stderr) | tee -a /tmp/stdout
