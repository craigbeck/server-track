const expect = require('chai').expect;
const server = require('../lib');

describe('service endpoints', () => {

  describe('POST /server', () => {

    it('should accept metrics', done => {

      const req = {
        method: 'POST',
        url: '/server',
        payload: {
          name: 'foobar',
          cpu: 0.13,
          ram: 0.41
        }
      };

      server.inject(req, response => {

        expect(response.statusCode).to.equal(200);

        expect(response.result)
          .to.have.property('link')
          .to.have.property('server', '/server/foobar');

        done();
      });
    });
  });

  describe('GET  /server', () => {

    it('should respond with list of servers', done => {

      const req = {
        method: 'GET',
        url: '/server'
      };

      server.inject(req, response => {

        expect(response.statusCode).to.equal(200);
        expect(response.result)
          .to.have.property('servers')
          .to.have.length(1);
        expect(response.result.servers[0])
          .to.have.property('name', 'foobar')
        done();
      });
    });
  });

  describe('GET  /server/{id}', () => {

    it('should respond with not found for unknown server id', done => {

      const req = {
        method: 'GET',
        url: '/server/foobar-123'
      };

      server.inject(req, response => {

        expect(response.statusCode).to.equal(404);
        done();
      });
    });

    it('should respond with metrics for known server id', done => {

      const post = {
        method: 'POST',
        url: '/server',
        payload: {
          name: 'foobar-137',
          cpu: 0.12,
          ram: 0.33
        }
      };

      server.inject(post, response => {
        const req = {
          method: 'GET',
          url: response.result.link.server
        };

        server.inject(req, response => {

          expect(response.statusCode).to.equal(200);

          expect(response.result)
            .to.have.property('name', 'foobar-137');

          expect(response.result)
            .to.have.property('link')
            .to.have.property('self', '/server/foobar-137');

          expect(response.result)
            .to.have.property('stats');

          done();
        });
      });
    });
  });
});
