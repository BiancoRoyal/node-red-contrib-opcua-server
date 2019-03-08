/**
 MIT License
 Copyright (c) 2018,2019 Bianco Royal Software Innovations® (https://bianco-royal.cloud/)
 **/

jest.setTimeout(20000);

const injectNode = require("node-red/nodes/core/core/20-inject");
const functionNode = require("node-red/nodes/core/core/80-function");
const debugMsgNode = require("node-red/nodes/core/core/58-debug");
const helper = require("node-red-node-test-helper");
helper.init(require.resolve("node-red"));
const nut = require("../../src/server-node");
const serverTestNodes = [injectNode, functionNode, debugMsgNode, nut];
let flow;

beforeAll(done => {
  flow = [
    {
      id: "b603b743.46eef8",
      type: "opcua-compact-server",
      z: "96df9d1b.b1b87",
      port: "54851",
      endpoint: "",
      productUri: "",
      acceptExternalCommands: true,
      maxAllowedSessionNumber: "10",
      maxConnectionsPerEndpoint: "10",
      maxAllowedSubscriptionNumber: "100",
      alternateHostname: "",
      name: "Compact-Server",
      showStatusActivities: false,
      showErrors: true,
      allowAnonymous: false,
      individualCerts: false,
      isAuditing: false,
      serverDiscovery: true,
      users: [
        {
          name: "klaus",
          password: "landsdorf"
        }
      ],
      xmlsetsOPCUA: [
        {
          name: "",
          path: "public/vendor/harting/10_di.xml"
        },
        {
          name: "",
          path: "public/vendor/harting/20_autoid.xml"
        },
        {
          name: "",
          path: "public/vendor/harting/30_aim.xml"
        }
      ],
      publicCertificateFile: "",
      privateCertificateFile: "",
      registerServerMethod: 1,
      discoveryServerEndpointUrl: "",
      capabilitiesForMDNS: "",
      maxNodesPerRead: 1000,
      maxNodesPerWrite: 1000,
      maxNodesPerHistoryReadData: 100,
      maxNodesPerBrowse: 3000,
      maxBrowseContinuationPoints: "10",
      maxHistoryContinuationPoints: "10",
      delayToInit: "1000",
      delayToClose: "200",
      serverShutdownTimeout: "100",
      addressSpaceScript:
        'function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {\n  // server = the created node-opcua server\n  // addressSpace = address space of the node-opcua server\n  // eventObjects = add event variables here to hold them in memory from this script\n\n  // internal sandbox objects are:\n  // node = the compact server node,\n  // coreServer = core compact server object for debug and access to NodeOPCUA\n  // this.sandboxNodeContext = node context node-red\n  // this.sandboxFlowContext = flow context node-red\n  // this.sandboxGlobalContext = global context node-red\n  // this.sandboxEnv = env variables\n  // timeout and interval functions as expected from nodejs\n\n  const opcua = coreServer.choreCompact.opcua;\n  const LocalizedText = opcua.LocalizedText;\n  const namespace = addressSpace.getOwnNamespace();\n\n  const Variant = opcua.Variant;\n  const DataType = opcua.DataType;\n  const DataValue = opcua.DataValue;\n\n  var flexServerInternals = this;\n\n  this.sandboxFlowContext.set("isoInput1", 0);\n  this.setInterval(() => {\n    flexServerInternals.sandboxFlowContext.set(\n      "isoInput1",\n      Math.random() + 50.0\n    );\n  }, 500);\n  this.sandboxFlowContext.set("isoInput2", 0);\n  this.sandboxFlowContext.set("isoInput3", 0);\n  this.sandboxFlowContext.set("isoInput4", 0);\n  this.sandboxFlowContext.set("isoInput5", 0);\n  this.sandboxFlowContext.set("isoInput6", 0);\n  this.sandboxFlowContext.set("isoInput7", 0);\n  this.sandboxFlowContext.set("isoInput8", 0);\n\n  this.sandboxFlowContext.set("isoOutput1", 0);\n  this.setInterval(() => {\n    flexServerInternals.sandboxFlowContext.set(\n      "isoOutput1",\n      Math.random() + 10.0\n    );\n  }, 500);\n\n  this.sandboxFlowContext.set("isoOutput2", 0);\n  this.sandboxFlowContext.set("isoOutput3", 0);\n  this.sandboxFlowContext.set("isoOutput4", 0);\n  this.sandboxFlowContext.set("isoOutput5", 0);\n  this.sandboxFlowContext.set("isoOutput6", 0);\n  this.sandboxFlowContext.set("isoOutput7", 0);\n  this.sandboxFlowContext.set("isoOutput8", 0);\n\n  coreServer.debugLog("init dynamic address space");\n  const rootFolder = addressSpace.findNode("RootFolder");\n\n  node.warn("construct new address space for OPC UA");\n\n  const myDevice = namespace.addFolder(rootFolder.objects, {\n    "browseName": "RaspberryPI-Zero-WLAN"\n  });\n  const gpioFolder = namespace.addFolder(myDevice, { "browseName": "GPIO" });\n  const isoInputs = namespace.addFolder(gpioFolder, {\n    "browseName": "Inputs"\n  });\n  const isoOutputs = namespace.addFolder(gpioFolder, {\n    "browseName": "Outputs"\n  });\n\n  const gpioDI1 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I1",\n    "nodeId": "ns=1;s=Isolated_Input1",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput1")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput1",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI2 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I2",\n    "nodeId": "ns=1;s=Isolated_Input2",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput2")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput2",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI3 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I3",\n    "nodeId": "ns=1;s=Isolated_Input3",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput3")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput3",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI4 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I4",\n    "nodeId": "ns=1;s=Isolated_Input4",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput4")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput4",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI5 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I5",\n    "nodeId": "ns=1;s=Isolated_Input5",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput5")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput5",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI6 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I6",\n    "nodeId": "ns=1;s=Isolated_Input6",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput6")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput6",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI7 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I7",\n    "nodeId": "ns=1;s=Isolated_Input7",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput7")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput7",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI8 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I8",\n    "nodeId": "ns=1;s=Isolated_Input8",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput8")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput8",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO1 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O1",\n    "nodeId": "ns=1;s=Isolated_Output1",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput1")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput1",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO2 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O2",\n    "nodeId": "ns=1;s=Isolated_Output2",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput2")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput2",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO3 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O3",\n    "nodeId": "ns=1;s=Isolated_Output3",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput3")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput3",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO4 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O4",\n    "nodeId": "ns=1;s=Isolated_Output4",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput4")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput4",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO5 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O5",\n    "nodeId": "ns=1;s=Isolated_Output5",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput5")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput5",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO6 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O6",\n    "nodeId": "ns=1;s=Isolated_Output6",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput6")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput6",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO7 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O7",\n    "nodeId": "ns=1;s=Isolated_Output7",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput7")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput7",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO8 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O8",\n    "nodeId": "ns=1;s=Isolated_Output8",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput8")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput8",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  //------------------------------------------------------------------------------\n  // Add a view\n  //------------------------------------------------------------------------------\n  const viewDI = namespace.addView({\n    "organizedBy": rootFolder.views,\n    "browseName": "RPIW0-Digital-Ins"\n  });\n\n  const viewDO = namespace.addView({\n    "organizedBy": rootFolder.views,\n    "browseName": "RPIW0-Digital-Outs"\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI1.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI2.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI3.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI4.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI5.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI6.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI7.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI8.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO1.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO2.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO3.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO4.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO5.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO6.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO7.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO8.nodeId\n  });\n\n  coreServer.debugLog("create dynamic address space done");\n  node.warn("construction of new address space for OPC UA done");\n\n  done();\n}\n',
      x: 250,
      y: 40,
      wires: []
    }
  ];
  helper.startServer(done);
});

afterAll(done => {
  helper.stopServer(done);
});

afterEach(done => {
  helper.unload();
  done();
});

test("should be loaded with context and should update context", done => {
  helper.load(serverTestNodes, flow, function() {
    let n1 = helper.getNode("b603b743.46eef8");
    expect(n1.name).toBe("Compact-Server");
    n1.on("server_node_error", err => {
      console.log(err);
    });
    n1.on("server_running", () => {
      setTimeout(done, 6000);
    });
  });
});
