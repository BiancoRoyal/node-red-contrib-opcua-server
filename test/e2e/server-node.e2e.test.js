/**
 MIT License
 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/
"use strict";

jest.setTimeout(20000);

const injectNode = require("@node-red/nodes/core/common/20-inject");
const functionNode = require("@node-red/nodes/core/function/10-function");
const debugMsgNode = require("@node-red/nodes/core/common/21-debug");

var helper = require("node-red-node-test-helper");
helper.init(require.resolve("node-red"));

const flows = require("./flows/server-e2e-flow");
const nut = require("../../src/server-node");
const serverTestNodes = [injectNode, functionNode, debugMsgNode, nut];

describe("OPC UA Flex-Server node e2e Testing", function () {
  beforeEach(function (done) {
    helper.startServer(function () {
      done();
    });
  });

  afterEach(function (done) {
    helper
      .unload()
      .then(function () {
        helper.stopServer(function () {
          done();
        });
      })
      .catch(function () {
        helper.stopServer(function () {
          done();
        });
      });
  });

  describe("Server node e2e", function () {
    it("should verify that the server is working with error", function (done) {
      helper.load(serverTestNodes, flows.serverFlow, function () {
        let n1 = helper.getNode("0397425415db6872");
        expect(n1.name).toBe("Compact-Server");
        n1.on("server_start_error", (err) => {
          console.log(err);
        });
        n1.on("server_node_error", (err) => {
          console.log(err);
        });
        n1.on("server_node_running", () => {
          console.log("server started");
        });
        n1.on("server_running", () => {
          setTimeout(done, 6000);
        });
      });
    });
  });
});
