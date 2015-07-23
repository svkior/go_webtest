#!/bin/bash
cd artnet_test/cmd
go get && go build && GODEBUG=gctrace=1 ./cmd
