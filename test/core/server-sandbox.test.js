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

  it("should remove a fired sandboxed setTimeout from node.outstandingTimers", function (done) {
    const contrib = coreServerSandbox;
    const EventEmitter = require("events");
    let node = new EventEmitter();
    node.error = jest.fn();
    contrib.initialize(node, {}, (node, vm) => {
      vm.run("setTimeout(function () {}, 5);");
      expect(node.outstandingTimers.length).toBe(1);
      setTimeout(() => {
        // once the timer has fired, it must be cleaned out of the
        // tracking array instead of staying there for the life of the node
        expect(node.outstandingTimers.length).toBe(0);
        expect(node.error).not.toHaveBeenCalled();
        done();
      }, 30);
    });
  });

  it("should route an error thrown inside a sandboxed setTimeout to node.error instead of crashing", function (done) {
    const contrib = coreServerSandbox;
    const EventEmitter = require("events");
    let node = new EventEmitter();
    node.error = jest.fn();
    contrib.initialize(node, {}, (node, vm) => {
      vm.run(
        "setTimeout(function () { throw new Error('boom from script'); }, 5);"
      );
      setTimeout(() => {
        expect(node.error).toHaveBeenCalledTimes(1);
        expect(node.error.mock.calls[0][0].message).toBe("boom from script");
        done();
      }, 30);
    });
  });

  it("should route an error thrown inside a sandboxed setInterval to node.error instead of crashing", function (done) {
    const contrib = coreServerSandbox;
    const EventEmitter = require("events");
    let node = new EventEmitter();
    node.error = jest.fn();
    contrib.initialize(node, {}, (node, vm) => {
      vm.run(
        "setInterval(function () { throw new Error('boom from interval'); }, 5);"
      );
      setTimeout(() => {
        // stop the interval from firing further and re-throwing on the test process
        node.outstandingIntervals.forEach((id) => clearInterval(id));
        expect(node.error).toHaveBeenCalled();
        expect(node.error.mock.calls[0][0].message).toBe(
          "boom from interval"
        );
        done();
      }, 30);
    });
  });
});
