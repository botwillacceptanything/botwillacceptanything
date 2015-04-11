#! /usr/bin/env bash

cd /src

git clone http://github.com/botwillacceptanything/botwillacceptanything.git

cd botwillacceptanything

npm install

cp config.template.js config.js

npm run main
