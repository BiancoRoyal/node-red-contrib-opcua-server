/**
 MIT License
 Copyright (c) 2018,2019 Bianco Royal Software Innovations® (https://bianco-royal.cloud/)
 **/

module.exports = function(RED) {
  // SOURCE-MAP-REQUIRED
  "use strict";
  function OPCUACompactServerNode(nodeConfig) {
    const coreChore = require("./core/chore");
    const coreServer = require("./core/server");
    const coreServerSandbox = require("./core/server-sandbox");

    RED.nodes.createNode(this, nodeConfig);
    this.name = nodeConfig.name;
    this.port = nodeConfig.port;

    let node = this;

    coreChore.listenForErrors(node);
    coreChore.setStatusPending(node);
    coreServer.readConfigOfServerNode(node, nodeConfig);

    let serveroptions = coreServer.defaultServerOptions();
    serveroptions.nodeset_filename = coreServer.loadNodeSets(node, __dirname);
    serveroptions.port = node.port;
    let opcuaServer;

    node.contribOPCUACompact = {};
    node.contribOPCUACompact.initialized = false;

    // function placeholder to fill it later from vm2 script
    node.contribOPCUACompact.constructAddressSpaceScript = (
      server,
      constructAddressSpaceScript,
      eventObjects
    ) => {
      coreServerSandbox.debugLog("Init Function Block Compact Server"); // placeholder function for sandbox compile
    };

    node.contribOPCUACompact.postInitialize = () => {
      node.contribOPCUACompact.eventObjects = {}; // event objects should stay in memory

      let addressSpace = opcuaServer.engine.addressSpace;
      addressSpace.registerNamespace(
        "http://biancoroyal.de/UA/NodeRED/Compact/"
      );

      coreServer
        .constructAddressSpaceFromScript(
          opcuaServer,
          node.contribOPCUACompact.constructAddressSpaceScript,
          node.contribOPCUACompact.eventObjects
        )
        .then(() => {
          coreChore.setStatusActive(node);
          node.emit("server_running");
        })
        .catch(err => {
          coreChore.setStatusError(node, err.message);
          node.emit("server_start_error");
        });
    };

    setTimeout(() => {
      opcuaServer = coreServer.initialize(node, serveroptions);
      opcuaServer.initialize(node.contribOPCUACompact.postInitialize);
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
          coreChore.setStatusActive(node);
        })
        .catch(err => {
          node.warn(err);
          node.emit("server_node_error", err);
        });
    }, node.delayToInit);

    node.on("close", function(done) {
      node.status({});
      coreServer.stop(node, opcuaServer, () => {
        setTimeout(done, node.delayToClose);
      });
    });
  }

  RED.httpAdmin.get(
    "/OPCUA/compact/xmlsets/public",
    RED.auth.needsPermission("opcuaCompact.xmlsets"),
    function(req, res) {
      let xmlset = [];
      const coreChore = require("./core/chore");
      xmlset.push(coreChore.de.bianco.royal.compact.opcua.di_nodeset_filename);
      xmlset.push(coreChore.de.bianco.royal.compact.opcua.adi_nodeset_filename);
      xmlset.push("public/vendor/opc-foundation/xml/Opc.ISA95.NodeSet2.xml");
      xmlset.push("public/vendor/opc-foundation/xml/Opc.Ua.Adi.NodeSet2.xml");
      xmlset.push("public/vendor/opc-foundation/xml/Opc.Ua.Di.NodeSet2.xml");
      xmlset.push("public/vendor/opc-foundation/xml/Opc.Ua.Gds.NodeSet2.xml");
      xmlset.push("public/vendor/harting/10_di.xml");
      xmlset.push("public/vendor/harting/20_autoid.xml");
      xmlset.push("public/vendor/harting/30_aim.xml");
      res.json(xmlset);
    }
  );

  RED.nodes.registerType("opcua-compact-server", OPCUACompactServerNode);
  RED.library.register("opcua");
};
