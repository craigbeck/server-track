const _ = require('lodash');

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = ONE_HOUR * 24;

// helper simulating async operations
//
// Why? Because I want to make sure that the
// Store's API is asynchronous. This fakes it
// until some point that a real implementation
// that would really be asynchronous is implemented
function deferred(args) {
  const promise = new Promise(resolve => {
    process.nextTick(() => {
      resolve(args);
    })
  });
  return promise;
}

const calculateLastDay = require('./calculate-by-hour');

function calculateLastHour(records) {
  const now = new Date();
  const limit = new Date(now.getTime() - ONE_HOUR);
  const values = _(records)
    .takeWhile(record => record.ts > limit)
    .groupBy(record => record.ts.getUTCMinutes())
    .value();

  const start = now.getUTCMinutes();
  const averages = [];
  const Y = now.getUTCFullYear();
  const M = now.getUTCMonth();
  const D = now.getUTCDay();

  for (var i = 0; i < 60; i++) {
    var key = start - i

    if (key < 0) {
      key = key + 60;
    }

    var minute = key;
    var hour = now.getUTCHours() - ((start - i < 0) ? 1 : 0);

    var timestamp = new Date(Y, M, D, hour, minute, 0, 0);

    var avgValue = !values[key]
      ? null
      : _.meanBy(values[key], 'value');

    var avgRecord = {
      ts: timestamp,
      value: avgValue
    };

    averages.unshift(avgRecord);
  }
  return averages;
}

function Store() {
  this.data = {};
}

Store.prototype.add = function add(args) {
  const key = args.name;
  if (!this.data[key]) {
    // initialize empty structure
    this.data[key] = {
      cpu: [],
      ram: []
    }
  }
  const now = new Date();
  this.data[key].cpu.unshift({ ts: args.ts || now, value: args.cpu});
  this.data[key].ram.unshift({ ts: args.ts || now, value: args.ram});
  return deferred(args);
}

Store.prototype.getStats = function getStats(name) {
  const record = this.data[name];

  if (!record) {
    return deferred(null);
  }

  const promise = new Promise(resolve => {
    process.nextTick(() => resolve({
      cpuAverage: {
        byMinute: calculateLastHour(record.cpu),
        byHour: calculateLastDay(record.cpu)
      },
      ramAverage: {
        byMinute: calculateLastHour(record.ram),
        byHour: calculateLastDay(record.ram)
      }
    }))
  })

  return promise;
}


module.exports = Store;
