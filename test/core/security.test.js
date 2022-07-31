/**
 MIT License
 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/

jest.setTimeout(10000);

describe("core.security unit testing", function () {
  const coreSecurity = require("../../src/core/security");

  it("should hold the default security functions for the nodes", function (done) {
    const contrib = coreSecurity;
    expect(contrib.checkUserLogon).toBeDefined();
    expect(contrib.isWindows).toBeDefined();
    expect(contrib.getPackagePathFromIndex).toBeDefined();
    expect(contrib.serverCertificateFile).toBeDefined();
    expect(contrib.serverCertificateFile(1024)).toMatch(
      /server_selfsigned_cert_1024.pem/
    );
    expect(contrib.serverKeyFile).toBeDefined();
    expect(contrib.serverKeyFile(2048)).toMatch(/server_key_2048.pem/);
    done();
  });

  it("should be true in user check", function (done) {
    const contrib = coreSecurity;
    expect(contrib.checkUserLogon()).toBeTruthy();
    done();
  });
});
