process.env.NODE_ENV = 'dev-multi';

const Cluster = require('es7frame/cluster');

if (!Cluster) return;

const Union = require('es7frame/union');

class Multi extends Union(require('es7frame/multi')) {}

module.exports = Multi;

Object.assign(Multi.desc, {
  type: 'multi',

  deps: {},

  members: {
    auth: require('./services/auth'),
    restapi: require('./services/restapi')
  }
});
