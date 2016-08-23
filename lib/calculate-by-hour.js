const _ = require('lodash');

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = ONE_HOUR * 24;


function calculateLastDay(records) {
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

module.exports = calculateLastDay;;
