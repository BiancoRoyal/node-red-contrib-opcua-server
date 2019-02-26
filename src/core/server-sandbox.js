/**
 MIT License
 Copyright (c) 2018,2019 Bianco Royal Software Innovations® (https://bianco-royal.cloud/)
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
        set: function() {
          node.context().set.apply(node, arguments);
        },
        get: function() {
          return node.context().get.apply(node, arguments);
        },
        keys: function() {
          return node.context().keys.apply(node, arguments);
        },
        get global() {
          return node.context().global;
        },
        get flow() {
          return node.context().flow;
        }
      },
      sandboxFlowContext: {
        set: function() {
          node.context().flow.set.apply(node, arguments);
        },
        get: function() {
          return node.context().flow.get.apply(node, arguments);
        },
        keys: function() {
          return node.context().flow.keys.apply(node, arguments);
        }
      },
      sandboxGlobalContext: {
        set: function() {
          node.context().global.set.apply(node, arguments);
        },
        get: function() {
          return node.context().global.get.apply(node, arguments);
        },
        keys: function() {
          return node.context().global.keys.apply(node, arguments);
        }
      },
      sandboxEnv: {
        get: function(envVar) {
          let flow = node._flow;
          return flow.getSetting(envVar);
        }
      },
      setTimeout: function() {
        let func = arguments[0];
        let timerId;
        arguments[0] = function() {
          sandbox.clearTimeout(timerId);
          try {
            func.apply(this, arguments);
          } catch (err) {
            node.error(err, {});
          }
        };
        timerId = setTimeout.apply(this, arguments);
        node.outstandingTimers.push(timerId);
        return timerId;
      },
      clearTimeout: function(id) {
        clearTimeout(id);
        let index = node.outstandingTimers.indexOf(id);
        if (index > -1) {
          node.outstandingTimers.splice(index, 1);
        }
      },
      setInterval: function() {
        let func = arguments[0];
        let timerId;
        arguments[0] = function() {
          try {
            func.apply(this, arguments);
          } catch (err) {
            node.error(err, {});
          }
        };
        timerId = setInterval.apply(this, arguments);
        node.outstandingIntervals.push(timerId);
        return timerId;
      },
      clearInterval: function(id) {
        clearInterval(id);
        let index = node.outstandingIntervals.indexOf(id);
        if (index > -1) {
          node.outstandingIntervals.splice(index, 1);
        }
      }
    };

    const vm = new VM({
      require: {
        builtin: ["fs", "Math", "Date", "console"]
      },
      sandbox
    });

    done(node, vm);
  }
};
