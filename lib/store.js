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

const calculate = require('./calculate');

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
        byMinute: calculate.byMinute(record.cpu),
        byHour: calculate.byHour(record.cpu)
      },
      ramAverage: {
        byMinute: calculate.byMinute(record.ram),
        byHour: calculate.byHour(record.ram)
      }
    }))
  })

  return promise;
}


module.exports = Store;
