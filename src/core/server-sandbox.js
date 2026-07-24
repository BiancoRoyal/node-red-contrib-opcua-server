/**
 MIT License
 Copyright (c) 2018-2022 Klaus Landsdorf (http://node-red.plus/)
 **/
"use strict";
module.exports = {
  choreCompact: require("./chore").de.bianco.royal.compact,
  debugLog: require("./chore").de.bianco.royal.compact.opcuaSandboxDebug,
  errorLog: require("./chore").de.bianco.royal.compact.opcuaErrorDebug,
  initialize: (node, coreServer, done) => {
    const { VM } = require("vm2");
    node.outstandingTimers = [];
    node.outstandingIntervals = [];

    /* istanbul ignore next */
    const sandbox = {
      node,
      coreServer,
      sandboxNodeContext: {
        set: function () {
          node.context().set.apply(node, arguments);
        },
        get: function () {
          return node.context().get.apply(node, arguments);
        },
        keys: function () {
          return node.context().keys.apply(node, arguments);
        },
        get global() {
          return node.context().global;
        },
        get flow() {
          return node.context().flow;
        },
      },
      sandboxFlowContext: {
        set: function () {
          node.context().flow.set.apply(node, arguments);
        },
        get: function () {
          return node.context().flow.get.apply(node, arguments);
        },
        keys: function () {
          return node.context().flow.keys.apply(node, arguments);
        },
      },
      sandboxGlobalContext: {
        set: function () {
          node.context().global.set.apply(node, arguments);
        },
        get: function () {
          return node.context().global.get.apply(node, arguments);
        },
        keys: function () {
          return node.context().global.keys.apply(node, arguments);
        },
      },
      sandboxEnv: {
        get: function (envVar) {
          const flow = node._flow;
          return flow.getSetting(envVar);
        },
      },
      setTimeout: function () {
        const args = Array.prototype.slice.call(arguments);
        const func = args[0];
        const extraArgs = args.slice(2);
        let timerId;
        args[0] = function () {
          sandbox.clearTimeout(timerId);
          try {
            func.apply(this, extraArgs);
          } catch (err) {
            node.error(err, {});
          }
        };
        timerId = setTimeout.apply(this, args);
        node.outstandingTimers.push(timerId);
        return timerId;
      },
      clearTimeout: function (id) {
        clearTimeout(id);
        const index = node.outstandingTimers.indexOf(id);
        if (index > -1) {
          node.outstandingTimers.splice(index, 1);
        }
      },
      setInterval: function () {
        const args = Array.prototype.slice.call(arguments);
        const func = args[0];
        const extraArgs = args.slice(2);
        args[0] = function () {
          try {
            func.apply(this, extraArgs);
          } catch (err) {
            node.error(err, {});
          }
        };
        const timerId = setInterval.apply(this, args);
        node.outstandingIntervals.push(timerId);
        return timerId;
      },
      clearInterval: function (id) {
        clearInterval(id);
        const index = node.outstandingIntervals.indexOf(id);
        if (index > -1) {
          node.outstandingIntervals.splice(index, 1);
        }
      },
    };

    const vm = new VM({
      require: {
        builtin: ["fs", "Math", "Date", "console"],
      },
      sandbox,
    });

    done(node, vm);
  },
};
