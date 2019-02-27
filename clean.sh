#!/usr/bin/env bash
rm -rf node_modules/

rm package-lock.json

rm -rf certificates/

npm i

gulp publish
