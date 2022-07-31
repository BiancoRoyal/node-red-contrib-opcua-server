![Platform Node-RED](https://img.shields.io/badge/Platform-Node--RED-red.png)
![Contrib OPC UA](http://b.repl.ca/v1/Contrib-OPC--UA-blue.png)
![License](https://img.shields.io/badge/License-MIT-orange.png)
[![NPM version](https://badge.fury.io/js/node-red-contrib-opcua-server.png)](https://www.npmjs.com/package/node-red-contrib-opcua-server)
![NodeJS_Version](https://img.shields.io/badge/NodeJS-14.19.1-green.png)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM download](https://img.shields.io/npm/dm/node-red-contrib-iiot-opcua.svg)](https://www.npmtrends.com/node-red-contrib-iiot-opcua)
[![Repository GitHub](http://b.repl.ca/v1/Repository-GitHub-orange.png)](https://github.com/BiancoRoyal/node-red-contrib-opcua-server)
[![Build and publish](https://github.com/BiancoRoyal/node-red-contrib-opcua-server/actions/workflows/build.yml/badge.svg)](https://github.com/BiancoRoyal/node-red-contrib-opcua-server/actions/workflows/build.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/b229fe21da624408b51d075e8e0800cc)](https://www.codacy.com/gh/BiancoRoyal/node-red-contrib-opcua-server/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=BiancoRoyal/node-red-contrib-opcua-server&amp;utm_campaign=Badge_Grade)

# node-red-contrib-opcua-server

A programmable OPC UA server for Node-RED based on node-opcua next generation version with less dependencies.

## Core

using next generation node-opcua version from [Etienne Rossignon](https://github.com/erossignon/)

## Install

Run the following command in your Node-RED user directory - typically `~/.node-red`

        npm install node-red-contrib-opcua-server

try these options on npm install to build from source if you have problems to install

        --unsafe-perm --build-from-source

## Debug

Debugging on remote devices is important to help users. The verbose logging
provides interesting points in different abstractions if IDE or console debugging is not possible.

Start debug with Node-RED in verbose (-v) mode to get a verbose logging:

    DEBUG=opcuaCompact* node-red -v 1>Node-RED-OPC-UA-Server.log 2>&1

or on local Node-RED

    DEBUG=opcuaCompact* node red.js -v 1>Node-RED-OPC-UA-Server.log 2>&1

## Code Style

Prettier

## Contribution

**Yes, sure!** Please help us to make it even better and send your pull requests or tests!

#### Happy coding!

## License

based on node-opcua we use MIT license
Copyright (c) 2019 [Bianco Royal Software Innovations®](https://github.com/BiancoRoyal/)
