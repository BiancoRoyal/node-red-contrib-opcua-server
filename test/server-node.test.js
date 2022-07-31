/**
 MIT License

 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/

jest.setTimeout(20000);

const injectNode = require("@node-red/nodes/core/common/20-inject");

var helper = require("node-red-node-test-helper");
helper.init(require.resolve("node-red"));

const flows = require("./flows/unit-test-flows");
const nut = require("../src/server-node.js");
const serverTestNodes = [injectNode, nut];

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

  describe("Server node", function () {
    it("should be loaded", function (done) {
      helper.load(serverTestNodes, flows.serverFlow, function () {
        let n1 = helper.getNode("nut1f1");
        expect(n1.name).toBe("opcua-compact-server-node");
        n1.on("server_node_error", (err) => {
          console.log(err);
        });
        n1.on("server_running", () => {
          done();
        });
      });
    });

    it("should be loaded and closed with delay", (done) => {
      helper.load(serverTestNodes, flows.serverFlow, function () {
        let n1 = helper.getNode("nut1f1");
        expect(n1.name).toBe("opcua-compact-server-node");
        n1.on("server_node_error", (err) => {
          console.log(err);
        });
        n1.on("server_running", () => {
          setTimeout(done, 4000);
        });
      });
    });

    it("should success on XMl Nodesets request", function (done) {
      helper.load(serverTestNodes, flows.serverFlow2, function () {
        helper
          .request()
          .get("/OPCUA/compact/xmlsets/public")
          .expect(200)
          .end(done);
      });
    });

    it("should not be loaded", (done) => {
      helper.load(serverTestNodes, flows.errorFlow, function () {
        let n1 = helper.getNode("nut1f1");
        expect(n1.name).toBe("opcua-compact-server-node");
        n1.on("server_start_error", (err) => {
          console.log(err);
          done();
        });
        n1.on("server_node_error", (err) => {
          console.log(err);
        });
        n1.on("server_node_running", () => {
          console.log("server started");
        });
        n1.on("server_running", () => {
          throw Error("running not expected");
        });
      });
    });
  });
});
