#!/usr/bin/env bash

docker run -d -p 3000:3000 -p 8080:8080 --name couchbase korczis/botwillacceptanything
