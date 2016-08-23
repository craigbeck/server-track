const _ = require('lodash');

function MetricsRecord() {
  const data = {};



  this.add = (key, value) => {
    if (!data[key]) {
      data[key] = [];
    }
    data[key].unshift(value);
  }

  this.getAverages = () => {
    const averages = Object.keys(data).reduce((acc, key) => {
      acc[key] = _(data[key])
        .groupBy(obj => obj.ts)
        .value();
      return acc;
    }, {})
  }
};

module.exports = MetricsRecord;
