#! /usr/bin/env bash

cd /src

git clone https://github.com/korczis/botwillacceptanything.git

cd botwillacceptanything

npm install

cp config.template.js config.js

npm run main
