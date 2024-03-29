const helperExtensions = require("../../test-helper-extensions");

module.exports = {
  serverFlow: helperExtensions.cleanFlowPositionData([
    {
      id: "0397425415db6872",
      type: "opcua-compact-server",
      z: "f41e694a515fc633",
      port: 54840,
      endpoint: "",
      productUri: "",
      acceptExternalCommands: true,
      maxAllowedSessionNumber: 10,
      maxConnectionsPerEndpoint: 10,
      maxAllowedSubscriptionNumber: 100,
      alternateHostname: "",
      name: "Compact-Server",
      showStatusActivities: false,
      showErrors: false,
      allowAnonymous: true,
      individualCerts: false,
      isAuditing: false,
      serverDiscovery: true,
      users: [],
      xmlsetsOPCUA: [],
      publicCertificateFile: "",
      privateCertificateFile: "",
      registerServerMethod: 1,
      discoveryServerEndpointUrl: "",
      capabilitiesForMDNS: "",
      maxNodesPerRead: 1000,
      maxNodesPerWrite: 1000,
      maxNodesPerHistoryReadData: 100,
      maxNodesPerBrowse: 3000,
      maxBrowseContinuationPoints: 10,
      maxHistoryContinuationPoints: 10,
      delayToInit: 1000,
      delayToClose: 200,
      serverShutdownTimeout: 100,
      addressSpaceScript:
        'function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {\n  // server = the created node-opcua server\n  // addressSpace = address space of the node-opcua server\n  // eventObjects = add event variables here to hold them in memory from this script\n\n  // internal sandbox objects are:\n  // node = the compact server node,\n  // coreServer = core compact server object for debug and access to NodeOPCUA\n  // this.sandboxNodeContext = node context node-red\n  // this.sandboxFlowContext = flow context node-red\n  // this.sandboxGlobalContext = global context node-red\n  // this.sandboxEnv = env variables\n  // timeout and interval functions as expected from nodejs\n\n  const opcua = coreServer.choreCompact.opcua;\n\n  // node-opcua example simple server\n  const namespace = addressSpace.getOwnNamespace();\n\n  // declare a new object\n  const device = namespace.addObject({\n    organizedBy: addressSpace.rootFolder.objects,\n    browseName: "MyDevice"\n  });\n\n  // add some variables\n  // add a variable named MyVariable1 to the newly created folder "MyDevice"\n  let variable1 = 1;\n\n  // emulate variable1 changing every 500 ms\n  setInterval(function () { variable1 += 1; }, 500);\n\n  namespace.addVariable({\n    componentOf: device,\n    browseName: "MyVariable1",\n    dataType: "Double",\n    value: {\n      get: function () {\n        return new opcua.Variant({ dataType: opcua.DataType.Double, value: variable1 });\n      }\n    }\n  });\n\n  // add a variable named MyVariable2 to the newly created folder "MyDevice"\n  let variable2 = 10.0;\n\n  namespace.addVariable({\n\n    componentOf: device,\n\n    nodeId: "ns=1;b=1020FFAA", // some opaque NodeId in namespace 4\n\n    browseName: "MyVariable2",\n\n    dataType: "Double",\n\n    value: {\n      get: function () {\n        return new opcua.Variant({ dataType: opcua.DataType.Double, value: variable2 });\n      },\n      set: function (variant) {\n        variable2 = parseFloat(variant.value);\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n        \n  done();\n}\n',
      x: 400,
      y: 220,
      wires: [],
    },
  ]),
};
