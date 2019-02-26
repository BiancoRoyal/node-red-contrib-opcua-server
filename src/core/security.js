/**
 MIT License
 Copyright (c) 2018,2019 Bianco Royal Software Innovations® (https://bianco-royal.cloud/)
 **/
"use strict";
const path = require("path");
const requireResolve = require.resolve("node-opcua-server");

/* istanbul ignore next */
function isWindows() {
  return process.platform === "win32";
}

function checkUserLogon() {
  return true;
}

/* istanbul ignore next */
function getPackagePathFromIndex() {
  if (isWindows()) {
    return requireResolve.replace("\\index.js", "");
  } else {
    return requireResolve.replace("/index.js", "");
  }
}

function serverCertificateFile(keybits) {
  return path.join(
    __dirname,
    "../../certificates/server_selfsigned_cert_" + keybits + ".pem"
  );
}

function serverKeyFile(keybits) {
  return path.join(
    __dirname,
    "../../certificates/server_key_" + keybits + ".pem"
  );
}

module.exports = {
  isWindows,
  checkUserLogon,
  getPackagePathFromIndex,
  serverCertificateFile,
  serverKeyFile
};
