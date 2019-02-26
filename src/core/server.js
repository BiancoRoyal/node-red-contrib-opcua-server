/**
 MIT License
 Copyright (c) 2018,2019 Bianco Royal Software Innovations® (https://bianco-royal.cloud/)
 **/
"use strict";
module.exports = {
  choreCompact: require("./chore").de.bianco.royal.compact,
  debugLog: require("./chore").de.bianco.royal.compact.opcuaServerDebug,
  detailLog: require("./chore").de.bianco.royal.compact.opcuaServerDetailsDebug,
  errorLog: require("./chore").de.bianco.royal.compact.opcuaErrorDebug,
  readConfigOfServerNode: (node, config) => {
    node.name = config.name;

    // network
    node.port = config.port;
    node.endpoint = config.endpoint;
    node.alternateHostname = config.alternateHostname;

    // limits
    node.maxAllowedSessionNumber =
      parseInt(config.maxAllowedSessionNumber) || 4;
    node.maxConnectionsPerEndpoint =
      parseInt(config.maxConnectionsPerEndpoint) || 4;
    node.maxAllowedSubscriptionNumber =
      parseInt(config.maxAllowedSubscriptionNumber) || 50;
    node.maxNodesPerRead = config.maxNodesPerRead || 1000;
    node.maxNodesPerWrite = config.maxNodesPerWrite || 1000;
    node.maxNodesPerHistoryReadData = config.maxNodesPerHistoryReadData || 100;
    node.maxNodesPerBrowse = config.maxNodesPerBrowse || 3000;

    node.delayToInit = config.delayToInit || 1000;
    node.delayToClose = config.delayToClose || 1000;
    node.serverShutdownTimeout = config.serverShutdownTimeout || 3000;
    node.showStatusActivities = config.showStatusActivities;
    node.showErrors = config.showErrors;

    // certificates
    node.publicCertificateFile = config.publicCertificateFile;
    node.privateCertificateFile = config.privateCertificateFile;

    // Security
    node.allowAnonymous = config.allowAnonymous;
    // User Management
    node.opcuaUsers = config.users;
    // XML-Set Management
    node.xmlsetsOPCUA = config.xmlsetsOPCUA;
    // Audit
    node.isAuditing = config.isAuditing;

    // discovery
    node.disableDiscovery = !config.serverDiscovery;
    node.registerServerMethod = config.registerServerMethod || 3;
    node.discoveryServerEndpointUrl = config.discoveryServerEndpointUrl;
    node.capabilitiesForMDNS = config.capabilitiesForMDNS
      ? config.capabilitiesForMDNS.split(",")
      : [config.capabilitiesForMDNS];

    return node;
  },
  initialize: (node, options) => {
    return new module.exports.choreCompact.opcua.OPCUAServer(options);
  },
  input: (node, msg) => {
    module.exports.choreCompact.betterAssert(msg.payload);
    node.warn(msg);
  },
  stop: (node, server, done) => {
    if (server) {
      server.shutdown(node.serverShutdownTimeout || 1000, done);
    }
  },
  loadNodeSets: (node, dirname) => {
    let standardNodeSetFile =
      module.exports.choreCompact.opcuaNodesets.standard_nodeset_file;
    let xmlFiles = [standardNodeSetFile];

    if (Array.isArray(node.xmlsetsOPCUA)) {
      node.xmlsetsOPCUA.forEach(xmlsetFileName => {
        if (xmlsetFileName.path) {
          if (xmlsetFileName.path.startsWith("public/vendor/")) {
            xmlFiles.push(
              module.exports.choreCompact.path.join(
                dirname,
                xmlsetFileName.path
              )
            );
          } else {
            xmlFiles.push(xmlsetFileName.path);
          }

          if (xmlsetFileName.path.includes("ISA95")) {
            // add server ISA95 extension to node-opcua
            module.exports.debugLog("installing ISA95 extend");
            // require("node-opcua-isa95")(module.exports.choreCompact.opcua);
          }
        }
      });
      module.exports.detailLog("appending xmlFiles: " + xmlFiles.toString());
    }

    module.exports.detailLog("node sets:" + xmlFiles.toString());

    return xmlFiles;
  },
  defaultServerOptions: () => {
    const applicationUri = module.exports.choreCompact.opcua.makeApplicationUrn(
      module.exports.choreCompact.opcua.get_fully_qualified_domain_name(),
      "NodeOPCUA-Server"
    );

    const certificateFile = module.exports.choreCompact.coreSecurity.serverCertificateFile(
      "2048"
    );
    const privateKeyFile = module.exports.choreCompact.coreSecurity.serverKeyFile(
      "2048"
    );

    return {
      port: 54840,
      nodeset_filename:
        module.exports.choreCompact.opcuaNodesets.standard_nodeset_file,
      resourcePath: "UA/NodeRED/Compact",
      buildInfo: {
        productName: "Node-RED OPC UA Compact Server",
        buildNumber: "20181001",
        buildDate: new Date(2018, 10, 1)
      },
      serverCapabilities: {
        maxBrowseContinuationPoints: 10,
        maxHistoryContinuationPoints: 10,
        operationLimits: {
          maxNodesPerRead: 1000,
          maxNodesPerWrite: 1000,
          maxNodesPerHistoryReadData: 100,
          maxNodesPerBrowse: 3000
        }
      },
      serverInfo: {
        applicationUri,
        productUri: "NodeOPCUA-Server",
        applicationName: { text: "NodeRED-Compact", locale: "en" },
        gatewayServerUri: null,
        discoveryProfileUri: null,
        discoveryUrls: []
      },
      maxAllowedSessionNumber: 4,
      maxConnectionsPerEndpoint: 4,
      allowAnonymous: true,
      certificateFile,
      privateKeyFile,
      userManager: {
        isValidUser: module.exports.choreCompact.coreSecurity.checkUserLogon
      },
      isAuditing: false,
      disableDiscovery: false
    };
  },
  constructAddressSpaceFromScript: (
    server,
    constructAddressSpaceScript,
    eventObjects
  ) => {
    return new Promise(function(resolve, reject) {
      if (
        server.engine &&
        constructAddressSpaceScript &&
        constructAddressSpaceScript !== ""
      ) {
        try {
          constructAddressSpaceScript(
            server,
            server.engine.addressSpace,
            eventObjects,
            resolve
          );
        } catch (err) {
          reject(err);
        }
      } else {
        reject(
          new Error("Wrong Parameters Construct AddressSpace From Script")
        );
      }
    });
  },
  run: (node, server) => {
    return new Promise(function(resolve, reject) {
      if (!server) {
        reject(new Error("Server Not Valid To Start"));
        return;
      }

      if (!node) {
        reject(new Error("Node Not Valid To Start"));
        return;
      }

      server.start(function(err) {
        if (err) {
          reject(err);
        } else {
          if (server.endpoints && server.endpoints.length) {
            server.endpoints.forEach(endpoint => {
              endpoint.endpointDescriptions().forEach(endpointDescription => {
                module.exports.debugLog(
                  "Server endpointUrl: " +
                    endpointDescription.endpointUrl +
                    " securityMode: " +
                    endpointDescription.securityMode.toString() +
                    " securityPolicyUri: " +
                    endpointDescription.securityPolicyUri
                    ? endpointDescription.securityPolicyUri.toString()
                    : "None Security Policy Uri"
                );
              });
            });

            let endpointUrl = server.endpoints[0].endpointDescriptions()[0]
              .endpointUrl;
            module.exports.debugLog(
              "Primary Server Endpoint URL " + endpointUrl
            );
          }

          server.on("newChannel", channel => {
            module.exports.debugLog(
              "Client connected with address = " +
                channel.remoteAddress +
                " port = " +
                channel.remotePort
            );
          });

          server.on("closeChannel", function(channel) {
            module.exports.debugLog(
              "Client disconnected with address = " +
                channel.remoteAddress +
                " port = " +
                channel.remotePort
            );
          });

          server.on("create_session", function(session) {
            module.exports.debugLog(
              "############## SESSION CREATED ##############"
            );
            if (session.clientDescription) {
              module.exports.detailLog(
                "Client application URI:" +
                  session.clientDescription.applicationUri
              );
              module.exports.detailLog(
                "Client product URI:" + session.clientDescription.productUri
              );
              module.exports.detailLog(
                "Client application name:" +
                  session.clientDescription.applicationName
                  ? session.clientDescription.applicationName.toString()
                  : "none application name"
              );
              module.exports.detailLog(
                "Client application type:" +
                  session.clientDescription.applicationType
                  ? session.clientDescription.applicationType.toString()
                  : "none application type"
              );
            }

            module.exports.debugLog(
              "Session name:" + session.sessionName
                ? session.sessionName.toString()
                : "none session name"
            );
            module.exports.debugLog(
              "Session timeout:" + session.sessionTimeout
            );
            module.exports.debugLog("Session id:" + session.sessionId);
          });

          server.on("session_closed", function(session, reason) {
            module.exports.debugLog(
              "############## SESSION CLOSED ##############"
            );
            module.exports.detailLog("reason:" + reason);
            module.exports.detailLog(
              "Session name:" + session.sessionName
                ? session.sessionName.toString()
                : "none session name"
            );
          });

          module.exports.debugLog("Server Initialized");

          if (server.serverInfo) {
            module.exports.detailLog(
              "Server Info:" + JSON.stringify(server.serverInfo)
            );
          }

          resolve();
        }
      });
    });
  }
};
