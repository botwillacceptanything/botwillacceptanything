#! /usr/bin/env bash

cd /src

git clone http://github.com/botwillacceptanything/botwillacceptanything.git

cd botwillacceptanything

npm install

cp configs/template.js configs/custom.js

npm run main
