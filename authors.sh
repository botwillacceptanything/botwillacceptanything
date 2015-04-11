#! /usr/bin/env bash

git shortlog -s -n | tee data/authors.txt
