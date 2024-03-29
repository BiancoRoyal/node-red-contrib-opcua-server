/**
 MIT License
 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/

module.exports = function (RED) {
  // SOURCE-MAP-REQUIRED
  "use strict";
  function OPCUACompactServerNode(nodeConfig) {
    const coreServer = require("./core/server");
    const coreServerSandbox = require("./core/server-sandbox");

    RED.nodes.createNode(this, nodeConfig);
    this.name = nodeConfig.name;
    this.port = nodeConfig.port;

    const node = this;
    let opcuaServer;
    coreServer.detailLog("create node " + node.id);
    coreServer.choreCompact.listenForErrors(node);
    coreServer.choreCompact.setStatusInit(node);
    coreServer.readConfigOfServerNode(node, nodeConfig);

    const initOPCUATimer = setTimeout(() => {
      coreServer.detailLog("pending node " + node.id);
      coreServer.choreCompact.setStatusPending(node);

      const opcuaServerOptions = coreServer.defaultServerOptions(node);
      /* opcuaServerOptions.nodeset_filename = coreServer.loadOPCUANodeSets(
        node,
        __dirname
      );*/
      node.contribOPCUACompact = {};
      node.contribOPCUACompact.initialized = false;

      // function placeholder to fill it later from vm2 script
      /* istanbul ignore next */
      node.contribOPCUACompact.constructAddressSpaceScript = (
        server,
        constructAddressSpaceScript,
        eventObjects
      ) => {
        coreServerSandbox.debugLog("Init Function Block Compact Server"); // placeholder function for sandbox compile
      };

      opcuaServer = coreServer.initialize(node, opcuaServerOptions);
      opcuaServer.initialize(() => {
        coreServer.postInitialize(node, opcuaServer);
      });

      coreServer
        .run(node, opcuaServer)
        .then(() => {
          coreServerSandbox.initialize(node, coreServer, (node, vm) => {
            node.contribOPCUACompact.vm = vm;
            vm.run(
              "node.contribOPCUACompact.constructAddressSpaceScript = " +
                nodeConfig.addressSpaceScript
            );
            node.contribOPCUACompact.initialized = true;
            node.emit("server_node_running");
          });
          coreServer.choreCompact.setStatusActive(node);
        })
        .catch((err) => {
          /* istanbul ignore next */
          node.warn(err);
          /* istanbul ignore next */
          node.emit("server_node_error", err);
        });
    }, node.delayToInit);

    function cleanSandboxTimer(node, done) {
      if (node.outstandingTimers) {
        // only present if we init the sandbox
        while (node.outstandingTimers.length > 0) {
          /* istanbul ignore next */
          clearTimeout(node.outstandingTimers.pop());
        }
        while (node.outstandingIntervals.length > 0) {
          /* istanbul ignore next */
          clearInterval(node.outstandingIntervals.pop());
        }
      }
      coreServer.detailLog("closed node " + node.id);
      done();
    }

    function closeServer(done) {
      if (initOPCUATimer) {
        clearTimeout(initOPCUATimer);
      }

      if (opcuaServer) {
        coreServer.stop(node, opcuaServer, () => {
          setTimeout(() => {
            coreServer.choreCompact.setStatusClosed(node);
            cleanSandboxTimer(node, done);
          }, node.delayToClose);
        });
      } else {
        done();
      }
    }

    node.on("close", (done) => {
      closeServer(done);
    });
  }

  RED.httpAdmin.get(
    "/OPCUA/compact/xmlsets/public",
    RED.auth.needsPermission("opcuaCompact.xmlsets"),
    function (req, res) {
      const xmlset = [];
      const coreChore = require("./core/chore");
      xmlset.push(coreChore.de.bianco.royal.compact.opcua.nodesets.di);
      xmlset.push(coreChore.de.bianco.royal.compact.opcua.nodesets.adi);
      res.json(xmlset);
    }
  );

  RED.nodes.registerType("opcua-compact-server", OPCUACompactServerNode);
  RED.library.register("opcua");
};
