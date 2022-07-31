/**
 MIT License
 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/

jest.setTimeout(10000);

describe("core.server unit testing", function () {
  const coreServer = require("../../src/core/server");

  it("should hold the default state functions for the node", function (done) {
    const contrib = coreServer;
    expect(contrib.initialize).toBeDefined();
    expect(contrib.run).toBeDefined();
    expect(contrib.stop).toBeDefined();
    done();
  });

  it("should initialize debugLog", function (done) {
    const contrib = coreServer;
    expect(contrib.initialize()).toBeDefined();
    expect(contrib.debugLog).toBeDefined();
    done();
  });

  it("should initialize errorLog", function (done) {
    const contrib = coreServer;
    expect(contrib.initialize()).toBeDefined();
    expect(contrib.errorLog).toBeDefined();
    done();
  });

  it("should initialize detailLog", function (done) {
    const contrib = coreServer;
    expect(contrib.initialize()).toBeDefined();
    expect(contrib.detailLog).toBeDefined();
    done();
  });
});
