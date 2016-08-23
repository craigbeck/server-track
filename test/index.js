const expect = require('chai').expect;

/*
1. Record load for a given server
This should take a:
  • server name (string)
  • CPU load (double)
  • RAM load (double)
And apply the values to an in-memory model used to provide the data in endpoint #2.

2. Display loads for a given server
This should return data (if it has any) for the given server:
  • A list of the average load values for the last 60 minutes broken down by minute
  • A list of the average load values for the last 24 hours broken down by hour
*/

describe('Store', function () {

  const Store = require('../lib/store');

  it('should save results', done => {
    const record = { name: 'foobar', cpu: 0.34, ram: 0.17 };
    Store.add(record)
      .then(actual => {
        expect(actual).to.deep.equal(record);
        done();
      })
      .catch(done);
  });

  it('should get results', done => {
    const oneMinuteAgo = new Date((new Date()).getTime() - (60 * 1000));
    Promise.all([
      Store.add({ name: 'foobar', cpu: 0.41, ram: 0.23, ts: oneMinuteAgo }),
      Store.add({ name: 'foobar', cpu: 0.39, ram: 0.23, ts: oneMinuteAgo })
    ]).then(() => {
        Store.getStats('foobar')
          .then(actual => {
            expect(actual).to.have.property('cpuAverage');
            expect(actual.cpuAverage.byMinute).to.have.length(60);
            expect(actual.cpuAverage.byMinute[0]).to.have.property('value', null);
            expect(actual.cpuAverage.byMinute[58]).to.have.property('value', 0.40);
            expect(actual.cpuAverage.byMinute[59]).to.have.property('value', 0.34);
            done();
          })
          .catch(done);
      });
  });
});
