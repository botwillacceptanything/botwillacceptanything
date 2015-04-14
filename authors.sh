#! /usr/bin/env bash

git log | git shortlog -s -n | tee data/authors.txt
