const _ = require('lodash');

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = ONE_HOUR * 24;

module.exports.byHour = byHour;
module.exports.byMinute = byMinute;

function byHour(records) {
  const now = new Date();
  const limit = new Date(now.getTime() - ONE_DAY);
  const values = _(records)
    .takeWhile(record => record.ts > limit)
    .groupBy(record => record.ts.getHours())
    .value();

  const start = now.getHours();
  const averages = [];
  const Y = now.getFullYear();
  const M = now.getMonth();

  for (var i = 0; i < 24; i++) {
    var key = start - i

    if (key < 0) {
      key = key + 24;
    }

    var hour = key;
    var day = now.getDay() - ((start - i < 0) ? 1 : 0);

    var timestamp = new Date(Y, M, day, hour, 0, 0, 0);

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

function byMinute(records) {
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
