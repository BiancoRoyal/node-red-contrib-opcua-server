#!/usr/bin/env bash

gulp publish

npm run test:coverage

npm publish --tag next
