const server = require('./lib');

server.register({
  register: require('good'),
  options: {
    ops: {
      interval: 10 * 1000
    },
    reporters: {
      console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
              log: '*',
              response: '*',
              ops: '*'
          }]
      }, {
          module: 'good-console'
      }, 'stdout']
    }
  }
});

server.start(err => {
  if (err) throw err;
  server.log(['info'], `server started ${server.info.uri}`);
});
