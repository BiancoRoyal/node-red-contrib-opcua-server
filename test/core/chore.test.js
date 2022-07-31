/**
 MIT License
 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/

jest.setTimeout(10000);

describe("core.chore unit testing", function () {
  const coreChore = require("../../src/core/chore").de.bianco.royal.compact;

  it("should have listening on error with message for node", function (done) {
    const EventEmitter = require("events");
    let node = new EventEmitter();
    coreChore.listenForErrors(node);
    node.on("error", done);
    node.emit("error");
  });

  it("should have setStatusInit for node", function (done) {
    coreChore.setStatusInit({
      status: (status) => {
        expect(status.fill).toBe("yellow");
        expect(status.shape).toBe("dot");
        expect(status.text).toBe("init");
        done();
      },
    });
  });

  it("should have setStatusPending for node", function (done) {
    coreChore.setStatusPending({
      status: (status) => {
        expect(status.fill).toBe("yellow");
        expect(status.shape).toBe("ring");
        expect(status.text).toBe("pending");
        done();
      },
    });
  });

  it("should have setStatusActive for node", function (done) {
    coreChore.setStatusActive({
      status: (status) => {
        expect(status.fill).toBe("green");
        expect(status.shape).toBe("dot");
        expect(status.text).toBe("active");
        done();
      },
    });
  });
});
