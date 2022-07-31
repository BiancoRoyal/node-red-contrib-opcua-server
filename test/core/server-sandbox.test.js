/**
 MIT License
 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/

jest.setTimeout(10000);

describe("core.server-sandbox unit testing", function () {
  const coreServerSandbox = require("../../src/core/server-sandbox");

  it("should hold the default state functions for the node", function (done) {
    const contrib = coreServerSandbox;
    expect(contrib.initialize).toBeDefined();
    done();
  });

  it("should initialize debugLog", function (done) {
    const contrib = coreServerSandbox;
    expect(contrib.initialize).toBeDefined();
    expect(contrib.debugLog).toBeDefined();
    done();
  });

  it("should initialize errorLog", function (done) {
    const contrib = coreServerSandbox;
    expect(contrib.initialize).toBeDefined();
    expect(contrib.errorLog).toBeDefined();
    done();
  });

  it("should initialize and call done", function (done) {
    const contrib = coreServerSandbox;
    const EventEmitter = require("events");
    let node = new EventEmitter();
    contrib.initialize(node, {}, (node, vm) => {
      expect(node).toBeDefined();
      expect(vm).toBeDefined();
      done();
    });
  });
});
