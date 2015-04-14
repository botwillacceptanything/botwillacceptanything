#! /usr/bin/env bash

git shortlog -s -n < /dev/tty | tee data/authors.txt
