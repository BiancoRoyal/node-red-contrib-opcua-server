/**
 MIT License
 Copyright (c) 2018,2019 Bianco Royal Software Innovations® (https://bianco-royal.cloud/)
 **/

jest.setTimeout(20000);

describe("opcua-compact-server node", function() {
  const injectNode = require("node-red/nodes/core/core/20-inject");
  const helper = require("node-red-node-test-helper");
  helper.init(require.resolve("node-red"));
  const nut = require("../src/server-node.js");
  const serverTestNodes = [injectNode, nut];
  let flow, flow2, errorFlow;

  beforeAll(done => {
    flow = [
      {
        id: "nut1f1",
        type: "opcua-compact-server",
        port: 55881,
        endpoint: "",
        acceptExternalCommands: true,
        maxAllowedSessionNumber: "",
        maxConnectionsPerEndpoint: "",
        maxAllowedSubscriptionNumber: "",
        alternateHostname: "",
        name: "opcua-compact-server-node",
        showStatusActivities: false,
        showErrors: true,
        allowAnonymous: true,
        individualCerts: false,
        isAuditing: false,
        serverDiscovery: true,
        users: [],
        xmlsetsOPCUA: [
          {
            name: "DI",
            path: "public/vendor/harting/10_di.xml"
          },
          {
            name: "AUTOID",
            path: "public/vendor/harting/20_autoid.xml"
          },
          {
            name: "AIM",
            path: "public/vendor/harting/30_aim.xml"
          }
        ],
        publicCertificateFile: "",
        privateCertificateFile: "",
        registerServerMethod: 3,
        discoveryServerEndpointUrl: "",
        capabilitiesForMDNS: "",
        maxNodesPerRead: 1000,
        maxNodesPerWrite: 1000,
        maxNodesPerHistoryReadData: 100,
        maxNodesPerBrowse: 3000,
        delayToInit: 100,
        delayToClose: 400,
        serverShutdownTimeout: 200,
        addressSpaceScript:
          'function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {\n  // server = the created node-opcua server\n  // addressSpace = address space of the node-opcua server\n  // eventObjects = add event variables here to hold them in memory from this script\n\n  // internal sandbox objects are:\n  // node = the compact server node,\n  // coreServer = core compact server object for debug and access to NodeOPCUA\n  // this.sandboxNodeContext = node context node-red\n  // this.sandboxFlowContext = flow context node-red\n  // this.sandboxGlobalContext = global context node-red\n  // this.sandboxEnv = env variables\n  // timeout and interval functions as expected from nodejs\n\n  const opcua = coreServer.choreCompact.opcua;\n  const rootFolder = addressSpace.findNode("RootFolder");\n\n  /*\n   *  BrowseName  AnalyserDeviceStateMachineType\n   *  Subtype of the FiniteStateMachineType defined in [UA Part 5]\n   *  IsAbstract  False\n   *  References      NodeClass   BrowseName                       DataType            TypeDefinition ModellingRule\n   *  HasComponent    Object      Powerup                          InitialStateType                   Mandatory\n   *  HasComponent    Object      Operating                        StateType                          Mandatory\n   *  HasComponent    Object      Local                            StateType                          Mandatory\n   *  HasComponent    Object      Maintenance                      StateType                          Mandatory\n   *  HasComponent    Object      Shutdown                         StateType                          Mandatory\n   *  HasComponent    Object      PowerupToOperatingTransition     TransitionType                     Mandatory\n   *  HasComponent    Object      OperatingToLocalTransition       TransitionType                     Mandatory\n   *  HasComponent    Object      OperatingToMaintenanceTransition TransitionType                     Mandatory\n   *  HasComponent    Object      LocalToOperatingTransition       TransitionType                     Mandatory\n   *  HasComponent    Object      LocalToMaintenanceTransition     TransitionType                     Mandatory\n   *  HasComponent    Object      MaintenanceToOperatingTransition TransitionType                     Mandatory\n   *  HasComponent    Object      MaintenanceToLocalTransition     TransitionType                     Mandatory\n   *  HasComponent    Object      OperatingToShutdownTransition    TransitionType                     Mandatory\n   *  HasComponent    Object      LocalToShutdownTransition        TransitionType                     Mandatory\n   *  HasComponent    Object      MaintenanceToShutdownTransition  TransitionType                     Mandatory\n   */\n\n  const namespace = addressSpace.getOwnNamespace();\n\n  const myFiniteStateMachine = namespace.addObjectType({\n    "browseName": "MyFiniteStateMachine",\n    "subtypeOf": "FiniteStateMachineType"\n  });\n\n  // The AnalyserDevice is in its power-up sequence and cannot perform any other task.\n  namespace.addState(myFiniteStateMachine, "Powerup", 100, true);\n\n  // The AnalyserDevice is in the Operating mode.\n  // The ADI Client uses this mode for normal operation: configuration, control and data collection.\n  // In this mode, each child AnalyserChannels are free to accept commands from the ADI Client and the\n  // Parameter values published in the address space values are expected to be valid.\n  // When entering this state, all AnalyserChannels of this AnalyserDevice automatically leave the SlaveMode\n  // state and enter their Operating state.\n  namespace.addState(myFiniteStateMachine, "Operating", 200);\n\n  // The AnalyserDevice is in the Local mode. This mode is normally used to perform local physical maintenance\n  // on the analyser.\n  // To enter the Local mode, the operator shall push a button, on the analyser itself. This may be a physical\n  // button or a graphical control on the local console screen. To quit the Local mode, the operator shall\n  // press the same or another button on the analyser itself.\n  // When the analyser is in Local mode, all child AnalyserChannels sit in the SlaveMode state of the\n  // AnalyserChannelStateMachine.\n  // In this mode, no commands are accepted from the ADI interface and no guarantee is given on the\n  // values in the address space.\n\n  namespace.addState(myFiniteStateMachine, "Local", 300);\n\n  // The AnalyserDevice is in the Maintenance mode. This mode is used to perform remote maintenance on the\n  // analyser like firmware upgrade.\n  // To enter in Maintenance mode, the operator shall call the GotoMaintenance Method from the ADI Client.\n  // To return to the Operating mode, the operator shall call the GotoOperating Method from the ADI Client.\n  // When the analyser is in the Maintenance mode, all child AnalyserChannels sit in the SlaveMode state of\n  // the AnalyserChannelStateMachine.\n  // In this mode, no commands are accepted from the ADI interface for the AnalyserChannels and no guarantee\n  // is given on the values in the address space.\n  namespace.addState(myFiniteStateMachine, "Maintenance", 400);\n\n  // The AnalyserDevice is in its power-down sequence and cannot perform any other task.\n  namespace.addState(myFiniteStateMachine, "Shutdown", 500);\n\n  namespace.addTransition(myFiniteStateMachine, "Powerup", "Operating", 1);\n  namespace.addTransition(myFiniteStateMachine, "Operating", "Local", 2);\n  namespace.addTransition(myFiniteStateMachine, "Operating", "Maintenance", 3);\n  namespace.addTransition(myFiniteStateMachine, "Local", "Operating", 4);\n  namespace.addTransition(myFiniteStateMachine, "Local", "Maintenance", 5);\n  namespace.addTransition(myFiniteStateMachine, "Maintenance", "Operating", 6);\n  namespace.addTransition(myFiniteStateMachine, "Maintenance", "Local", 7);\n  namespace.addTransition(myFiniteStateMachine, "Operating", "Shutdown", 8);\n  namespace.addTransition(myFiniteStateMachine, "Local", "Shutdown", 9);\n  namespace.addTransition(myFiniteStateMachine, "Maintenance", "Shutdown", 10);\n\n  myFiniteStateMachine.instantiate({\n    "organizedBy": rootFolder.objects,\n    "browseName": "BiancoRoyalFSM"\n  });\n        \n  done();\n}\n',
        wires: [[]]
      }
    ];
    flow2 = [
      {
        id: "nut1f2",
        type: "opcua-compact-server",
        port: 55882,
        endpoint: "",
        acceptExternalCommands: true,
        maxAllowedSessionNumber: "",
        maxConnectionsPerEndpoint: "",
        maxAllowedSubscriptionNumber: "",
        alternateHostname: "",
        name: "",
        showStatusActivities: false,
        showErrors: true,
        allowAnonymous: true,
        individualCerts: false,
        isAuditing: false,
        serverDiscovery: true,
        users: [],
        xmlsetsOPCUA: [],
        publicCertificateFile: "",
        privateCertificateFile: "",
        registerServerMethod: 3,
        discoveryServerEndpointUrl: "",
        capabilitiesForMDNS: "",
        maxNodesPerRead: 1000,
        maxNodesPerWrite: 1000,
        maxNodesPerHistoryReadData: 100,
        maxNodesPerBrowse: 3000,
        delayToInit: 100,
        delayToClose: 400,
        serverShutdownTimeout: 200,
        addressSpaceScript:
          "function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) { done(); }",
        wires: [[]]
      }
    ];
    errorFlow = [
      {
        id: "nut1f1",
        type: "opcua-compact-server",
        port: 55883,
        endpoint: "",
        acceptExternalCommands: true,
        maxAllowedSessionNumber: "",
        maxConnectionsPerEndpoint: "",
        maxAllowedSubscriptionNumber: "",
        alternateHostname: "",
        name: "opcua-compact-server-node",
        showStatusActivities: false,
        showErrors: true,
        allowAnonymous: true,
        individualCerts: false,
        isAuditing: false,
        serverDiscovery: true,
        users: [],
        xmlsetsOPCUA: [
          {
            name: "DI",
            path: "public/vendor/harting/10_di.xml"
          },
          {
            name: "AUTOID",
            path: "public/vendor/harting/20_autoid.xml"
          },
          {
            name: "AIM",
            path: "public/vendor/harting/30_aim.xml"
          }
        ],
        publicCertificateFile: "",
        privateCertificateFile: "",
        registerServerMethod: 3,
        discoveryServerEndpointUrl: "",
        capabilitiesForMDNS: "",
        maxNodesPerRead: 1000,
        maxNodesPerWrite: 1000,
        maxNodesPerHistoryReadData: 100,
        maxNodesPerBrowse: 3000,
        delayToInit: 100,
        delayToClose: 400,
        serverShutdownTimeout: 200,
        addressSpaceScript:
          'function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {\n  // server = the created node-opcua server\n  // addressSpace = address space of the node-opcua server\n  // eventObjects = add event variables here to hold them in memory from this script\n\n  // internal sandbox objects are:\n  // node = the compact server node,\n  // coreServer = core compact server object for debug and access to NodeOPCUA\n  // this.sandboxNodeContext = node context node-red\n  // this.sandboxFlowContext = flow context node-red\n  // this.sandboxGlobalContext = global context node-red\n  // this.sandboxEnv = env variables\n  // timeout and interval functions as expected from nodejs\n  const LocalizedText = opcua.LocalizedText;\n  const namespace = addressSpace.getOwnNamespace();\n\n  const Variant = opcua.Variant;\n  const DataType = opcua.DataType;\n  const DataValue = opcua.DataValue;\n\n  var flexServerInternals = this;\n\n  this.sandboxFlowContext.set("isoInput1", 0);\n  this.setInterval(() => {\n    flexServerInternals.sandboxFlowContext.set(\n      "isoInput1",\n      Math.random() + 50.0\n    );\n  }, 500);\n  this.sandboxFlowContext.set("isoInput2", 0);\n  this.sandboxFlowContext.set("isoInput3", 0);\n  this.sandboxFlowContext.set("isoInput4", 0);\n  this.sandboxFlowContext.set("isoInput5", 0);\n  this.sandboxFlowContext.set("isoInput6", 0);\n  this.sandboxFlowContext.set("isoInput7", 0);\n  this.sandboxFlowContext.set("isoInput8", 0);\n\n  this.sandboxFlowContext.set("isoOutput1", 0);\n  this.setInterval(() => {\n    flexServerInternals.sandboxFlowContext.set(\n      "isoOutput1",\n      Math.random() + 10.0\n    );\n  }, 500);\n\n  this.sandboxFlowContext.set("isoOutput2", 0);\n  this.sandboxFlowContext.set("isoOutput3", 0);\n  this.sandboxFlowContext.set("isoOutput4", 0);\n  this.sandboxFlowContext.set("isoOutput5", 0);\n  this.sandboxFlowContext.set("isoOutput6", 0);\n  this.sandboxFlowContext.set("isoOutput7", 0);\n  this.sandboxFlowContext.set("isoOutput8", 0);\n\n  coreServer.debugLog("init dynamic address space");\n  const rootFolder = addressSpace.findNode("RootFolder");\n\n  node.warn("construct new address space for OPC UA");\n\n  const myDevice = namespace.addFolder(rootFolder.objects, {\n    "browseName": "RaspberryPI-Zero-WLAN"\n  });\n  const gpioFolder = namespace.addFolder(myDevice, { "browseName": "GPIO" });\n  const isoInputs = namespace.addFolder(gpioFolder, {\n    "browseName": "Inputs"\n  });\n  const isoOutputs = namespace.addFolder(gpioFolder, {\n    "browseName": "Outputs"\n  });\n\n  const gpioDI1 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I1",\n    "nodeId": "ns=1;s=Isolated_Input1",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput1")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput1",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI2 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I2",\n    "nodeId": "ns=1;s=Isolated_Input2",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput2")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput2",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI3 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I3",\n    "nodeId": "ns=1;s=Isolated_Input3",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput3")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput3",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI4 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I4",\n    "nodeId": "ns=1;s=Isolated_Input4",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput4")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput4",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI5 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I5",\n    "nodeId": "ns=1;s=Isolated_Input5",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput5")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput5",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI6 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I6",\n    "nodeId": "ns=1;s=Isolated_Input6",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput6")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput6",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI7 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I7",\n    "nodeId": "ns=1;s=Isolated_Input7",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput7")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput7",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDI8 = namespace.addVariable({\n    "organizedBy": isoInputs,\n    "browseName": "I8",\n    "nodeId": "ns=1;s=Isolated_Input8",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoInput8")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoInput8",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO1 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O1",\n    "nodeId": "ns=1;s=Isolated_Output1",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput1")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput1",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO2 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O2",\n    "nodeId": "ns=1;s=Isolated_Output2",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput2")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput2",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO3 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O3",\n    "nodeId": "ns=1;s=Isolated_Output3",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput3")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput3",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO4 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O4",\n    "nodeId": "ns=1;s=Isolated_Output4",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput4")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput4",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO5 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O5",\n    "nodeId": "ns=1;s=Isolated_Output5",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput5")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput5",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO6 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O6",\n    "nodeId": "ns=1;s=Isolated_Output6",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput6")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput6",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO7 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O7",\n    "nodeId": "ns=1;s=Isolated_Output7",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput7")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput7",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  const gpioDO8 = namespace.addVariable({\n    "organizedBy": isoOutputs,\n    "browseName": "O8",\n    "nodeId": "ns=1;s=Isolated_Output8",\n    "dataType": "Double",\n    "value": {\n      "get": function() {\n        return new Variant({\n          "dataType": DataType.Double,\n          "value": flexServerInternals.sandboxFlowContext.get("isoOutput8")\n        });\n      },\n      "set": function(variant) {\n        flexServerInternals.sandboxFlowContext.set(\n          "isoOutput8",\n          parseFloat(variant.value)\n        );\n        return opcua.StatusCodes.Good;\n      }\n    }\n  });\n\n  //------------------------------------------------------------------------------\n  // Add a view\n  //------------------------------------------------------------------------------\n  const viewDI = namespace.addView({\n    "organizedBy": rootFolder.views,\n    "browseName": "RPIW0-Digital-Ins"\n  });\n\n  const viewDO = namespace.addView({\n    "organizedBy": rootFolder.views,\n    "browseName": "RPIW0-Digital-Outs"\n  });\n\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI1.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI2.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI3.nodeId\n  });\n\n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI4.nodeId\n  });\n  \n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI5.nodeId\n  });\n  \n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI6.nodeId\n  });\n  \n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI7.nodeId\n  });\n  \n  viewDI.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDI8.nodeId\n  });\n  \n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO1.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO2.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO3.nodeId\n  });\n\n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO4.nodeId\n  });\n  \n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO5.nodeId\n  });\n  \n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO6.nodeId\n  });\n  \n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO7.nodeId\n  });\n  \n  viewDO.addReference({\n    "referenceType": "Organizes",\n    "nodeId": gpioDO8.nodeId\n  });\n\n  coreServer.debugLog("create dynamic address space done");\n  node.warn("construction of new address space for OPC UA done");\n\n  done();\n}\n',
        wires: [[]]
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

  it("should be loaded", done => {
    helper.load(serverTestNodes, flow, function() {
      let n1 = helper.getNode("nut1f1");
      expect(n1.name).toBe("opcua-compact-server-node");
      n1.on("server_node_error", err => {
        console.log(err);
      });
      n1.on("server_running", () => {
        done();
      });
    });
  });

  it("should success on XMl Nodesets request", function(done) {
    helper.load(serverTestNodes, flow2, function() {
      helper
        .request()
        .get("/OPCUA/compact/xmlsets/public")
        .expect(200)
        .end(done);
    });
  });

  it("should not be loaded", done => {
    helper.load(serverTestNodes, errorFlow, function() {
      let n1 = helper.getNode("nut1f1");
      expect(n1.name).toBe("opcua-compact-server-node");
      n1.on("server_start_error", err => {
        console.log(err);
        done();
      });
    });
  });
});
