const Hapi = require('hapi');
const Joi = require('Joi');
const Boom = require('boom');
const Store = require('./store');


const server = new Hapi.Server();
const store = new Store();

server.connection({ port: process.env.PORT || 3001 });

server.route({
  method: 'POST',
  path: '/server',
  config: {
    validate: {
      payload: {
        name: Joi.string().required(),
        cpu: Joi.number().positive(),
        ram: Joi.number().positive()
      }
    },
    handler: (request, reply) => {
      store.add(request.payload)
        .then(reply({
          link: {
            server: `/server/${request.payload.name}`
          }
        }))
    }
  }
});

server.route({
  method: 'GET',
  path: '/server',
  handler: (request, reply) => {
    const servers = Object.keys(store.data).map(key => ({ name: key, link: { server: `/server/${key}` }}))
    reply({ servers: servers });
  }
});

server.route({
  method: 'GET',
  path: '/server/{name}',
  config: {
    validate: {
      params: {
        name: Joi.string().required()
      }
    },
    handler: (request, reply) => {
      const name = request.params.name;
      store.getStats(name)
        .then(stats => {
          if (!stats) {
            return reply(Boom.notFound(`Server with id ${name} not found`));
          }
          reply({
            name: name,
            link: {
              self: `/server/${name}`
            },
            stats: stats
          })
        });
    }
  }
});


module.exports = server;
