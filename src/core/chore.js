/**
 MIT License
 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/
'use strict'
module.exports = {
  de: {
    bianco: {
      royal: {
        compact: {
          path: require('path'),
          betterAssert: require('better-assert'),
          opcuaDebug: require('debug')('opcuaCompact'),
          opcuaServerDebug: require('debug')('opcuaCompact:server'),
          opcuaServerDetailsDebug: require('debug')(
            'opcuaCompact:server:details'
          ),
          opcuaSandboxDebug: require('debug')('opcuaCompact:sandbox'),
          opcuaErrorDebug: require('debug')('opcuaCompact:error'),
          opcua: require('node-opcua'),
          opcuaNodesets: require('node-opcua-nodesets'),
          coreSecurity: require('./security'),
          opcuaNodeColor: '#20B2aa',
          opcuaNodeCategory: 'opcua',
          opcuaNodeIcon: 'icon.png',
          listenForErrors: node => {
            node.on('error', err => {
              module.exports.de.bianco.royal.compact.opcuaErrorDebug(err)
            })
          },
          setStatusPending: node => {
            node.status({
              fill: 'yellow',
              shape: 'ring',
              text: 'pending'
            })
          },
          setStatusInit: node => {
            node.status({
              fill: 'yellow',
              shape: 'dot',
              text: 'init'
            })
          },
          setStatusActive: node => {
            node.status({
              fill: 'green',
              shape: 'dot',
              text: 'active'
            })
          },
          setStatusClosed: node => {
            node.status({
              fill: 'yellow',
              shape: 'ring',
              text: 'closed'
            })
          },
          setStatusError: (node, text) => {
            node.status({
              fill: 'red',
              shape: 'dot',
              text
            })
          }
        }
      }
    }
  }
}
