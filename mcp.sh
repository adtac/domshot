#!/usr/bin/env bash

cd "$(dirname -- "${BASH_SOURCE[0]}")"
killall -9 domshot
go build -o domshot
./domshot
