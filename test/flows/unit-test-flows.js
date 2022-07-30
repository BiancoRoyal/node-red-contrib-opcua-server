module.exports = {

  'serverFlow': [
    {
      'id': 'nut1f1',
      'type': 'opcua-compact-server',
      'port': 55881,
      'endpoint': '',
      'acceptExternalCommands': true,
      'maxAllowedSessionNumber': '',
      'maxConnectionsPerEndpoint': '',
      'maxAllowedSubscriptionNumber': '',
      'alternateHostname': '',
      'name': 'opcua-compact-server-node',
      'showStatusActivities': false,
      'showErrors': true,
      'allowAnonymous': true,
      'individualCerts': false,
      'isAuditing': false,
      'serverDiscovery': true,
      'users': [],
      'xmlsetsOPCUA': [
        {
          'name': 'DI',
          'path': 'public/vendor/harting/10_di.xml'
        },
        {
          'name': 'AUTOID',
          'path': 'public/vendor/harting/20_autoid.xml'
        },
        {
          'name': 'AIM',
          'path': 'public/vendor/harting/30_aim.xml'
        }
      ],
      'publicCertificateFile': '',
      'privateCertificateFile': '',
      'registerServerMethod': 1,
      'discoveryServerEndpointUrl': '',
      'capabilitiesForMDNS': '',
      'maxNodesPerRead': 1000,
      'maxNodesPerWrite': 1000,
      'maxNodesPerHistoryReadData': 100,
      'maxNodesPerBrowse': 3000,
      'delayToInit': 1000,
      'delayToClose': 200,
      'serverShutdownTimeout': 100,
      'addressSpaceScript': 'function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {\n  // server = the created node-opcua server\n  // addressSpace = address space of the node-opcua server\n  // eventObjects = add event variables here to hold them in memory from this script\n\n  // internal sandbox objects are:\n  // node = the compact server node,\n  // coreServer = core compact server object for debug and access to NodeOPCUA\n  // this.sandboxNodeContext = node context node-red\n  // this.sandboxFlowContext = flow context node-red\n  // this.sandboxGlobalContext = global context node-red\n  // this.sandboxEnv = env variables\n  // timeout and interval functions as expected from nodejs\n\n  const opcua = coreServer.choreCompact.opcua;\n  const rootFolder = addressSpace.findNode("RootFolder");\n\n  /*\n   *  BrowseName  AnalyserDeviceStateMachineType\n   *  Subtype of the FiniteStateMachineType defined in [UA Part 5]\n   *  IsAbstract  False\n   *  References      NodeClass   BrowseName                       DataType            TypeDefinition ModellingRule\n   *  HasComponent    Object      Powerup                          InitialStateType                   Mandatory\n   *  HasComponent    Object      Operating                        StateType                          Mandatory\n   *  HasComponent    Object      Local                            StateType                          Mandatory\n   *  HasComponent    Object      Maintenance                      StateType                          Mandatory\n   *  HasComponent    Object      Shutdown                         StateType                          Mandatory\n   *  HasComponent    Object      PowerupToOperatingTransition     TransitionType                     Mandatory\n   *  HasComponent    Object      OperatingToLocalTransition       TransitionType                     Mandatory\n   *  HasComponent    Object      OperatingToMaintenanceTransition TransitionType                     Mandatory\n   *  HasComponent    Object      LocalToOperatingTransition       TransitionType                     Mandatory\n   *  HasComponent    Object      LocalToMaintenanceTransition     TransitionType                     Mandatory\n   *  HasComponent    Object      MaintenanceToOperatingTransition TransitionType                     Mandatory\n   *  HasComponent    Object      MaintenanceToLocalTransition     TransitionType                     Mandatory\n   *  HasComponent    Object      OperatingToShutdownTransition    TransitionType                     Mandatory\n   *  HasComponent    Object      LocalToShutdownTransition        TransitionType                     Mandatory\n   *  HasComponent    Object      MaintenanceToShutdownTransition  TransitionType                     Mandatory\n   */\n\n  const namespace = addressSpace.getOwnNamespace();\n\n  const myFiniteStateMachine = namespace.addObjectType({\n    "browseName": "MyFiniteStateMachine",\n    "subtypeOf": "FiniteStateMachineType"\n  });\n\n  // The AnalyserDevice is in its power-up sequence and cannot perform any other task.\n  namespace.addState(myFiniteStateMachine, "Powerup", 100, true);\n\n  // The AnalyserDevice is in the Operating mode.\n  // The ADI Client uses this mode for normal operation: configuration, control and data collection.\n  // In this mode, each child AnalyserChannels are free to accept commands from the ADI Client and the\n  // Parameter values published in the address space values are expected to be valid.\n  // When entering this state, all AnalyserChannels of this AnalyserDevice automatically leave the SlaveMode\n  // state and enter their Operating state.\n  namespace.addState(myFiniteStateMachine, "Operating", 200);\n\n  // The AnalyserDevice is in the Local mode. This mode is normally used to perform local physical maintenance\n  // on the analyser.\n  // To enter the Local mode, the operator shall push a button, on the analyser itself. This may be a physical\n  // button or a graphical control on the local console screen. To quit the Local mode, the operator shall\n  // press the same or another button on the analyser itself.\n  // When the analyser is in Local mode, all child AnalyserChannels sit in the SlaveMode state of the\n  // AnalyserChannelStateMachine.\n  // In this mode, no commands are accepted from the ADI interface and no guarantee is given on the\n  // values in the address space.\n\n  namespace.addState(myFiniteStateMachine, "Local", 300);\n\n  // The AnalyserDevice is in the Maintenance mode. This mode is used to perform remote maintenance on the\n  // analyser like firmware upgrade.\n  // To enter in Maintenance mode, the operator shall call the GotoMaintenance Method from the ADI Client.\n  // To return to the Operating mode, the operator shall call the GotoOperating Method from the ADI Client.\n  // When the analyser is in the Maintenance mode, all child AnalyserChannels sit in the SlaveMode state of\n  // the AnalyserChannelStateMachine.\n  // In this mode, no commands are accepted from the ADI interface for the AnalyserChannels and no guarantee\n  // is given on the values in the address space.\n  namespace.addState(myFiniteStateMachine, "Maintenance", 400);\n\n  // The AnalyserDevice is in its power-down sequence and cannot perform any other task.\n  namespace.addState(myFiniteStateMachine, "Shutdown", 500);\n\n  namespace.addTransition(myFiniteStateMachine, "Powerup", "Operating", 1);\n  namespace.addTransition(myFiniteStateMachine, "Operating", "Local", 2);\n  namespace.addTransition(myFiniteStateMachine, "Operating", "Maintenance", 3);\n  namespace.addTransition(myFiniteStateMachine, "Local", "Operating", 4);\n  namespace.addTransition(myFiniteStateMachine, "Local", "Maintenance", 5);\n  namespace.addTransition(myFiniteStateMachine, "Maintenance", "Operating", 6);\n  namespace.addTransition(myFiniteStateMachine, "Maintenance", "Local", 7);\n  namespace.addTransition(myFiniteStateMachine, "Operating", "Shutdown", 8);\n  namespace.addTransition(myFiniteStateMachine, "Local", "Shutdown", 9);\n  namespace.addTransition(myFiniteStateMachine, "Maintenance", "Shutdown", 10);\n\n  myFiniteStateMachine.instantiate({\n    "organizedBy": rootFolder.objects,\n    "browseName": "BiancoRoyalFSM"\n  });\n        \n  done();\n}\n',
      'wires': [
        []
      ]
    }
  ],

  'serverFlow2': [
    {
      'id': 'nut1f2',
      'type': 'opcua-compact-server',
      'port': 55882,
      'endpoint': '',
      'acceptExternalCommands': true,
      'maxAllowedSessionNumber': '',
      'maxConnectionsPerEndpoint': '',
      'maxAllowedSubscriptionNumber': '',
      'alternateHostname': '',
      'name': '',
      'showStatusActivities': false,
      'showErrors': true,
      'allowAnonymous': true,
      'individualCerts': false,
      'isAuditing': false,
      'serverDiscovery': true,
      'users': [],
      'xmlsetsOPCUA': [],
      'publicCertificateFile': '',
      'privateCertificateFile': '',
      'registerServerMethod': 1,
      'discoveryServerEndpointUrl': '',
      'capabilitiesForMDNS': '',
      'maxNodesPerRead': 1000,
      'maxNodesPerWrite': 1000,
      'maxNodesPerHistoryReadData': 100,
      'maxNodesPerBrowse': 3000,
      'delayToInit': 1000,
      'delayToClose': 200,
      'serverShutdownTimeout': 100,
      'addressSpaceScript': 'function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) { done(); }',
      'wires': [
        []
      ]
    }
  ],

  'errorFlow': [
    {
      "id": "nut1f1",
      "type": "opcua-compact-server",
      "port": 55883,
      "endpoint": "",
      "acceptExternalCommands": true,
      "maxAllowedSessionNumber": "",
      "maxConnectionsPerEndpoint": "",
      "maxAllowedSubscriptionNumber": "",
      "alternateHostname": "",
      "name": "opcua-compact-server-node",
      "showStatusActivities": false,
      "showErrors": true,
      "allowAnonymous": true,
      "individualCerts": false,
      "isAuditing": false,
      "serverDiscovery": true,
      "users": [],
      "xmlsetsOPCUA": [],
      "publicCertificateFile": "",
      "privateCertificateFile": "",
      "registerServerMethod": 1,
      "discoveryServerEndpointUrl": "",
      "capabilitiesForMDNS": "",
      "maxNodesPerRead": 1000,
      "maxNodesPerWrite": 1000,
      "maxNodesPerHistoryReadData": 100,
      "maxNodesPerBrowse": 3000,
      "delayToInit": 1000,
      "delayToClose": 200,
      "serverShutdownTimeout": 100,
      "addressSpaceScript": "function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {\n  coreServer.debugLog(\"create dynamic address space done\");\n  node.warn(\"construction of new address space for OPC UA done\");\n\n  done();\n}\n",
      "wires": [
        []
      ]
    }
  ]
}
