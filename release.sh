#!/usr/bin/env bash

gulp publish

npm test:coverage

npm publish
