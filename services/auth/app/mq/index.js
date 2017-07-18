const Union = require('es7frame/union');

class Mq extends Union(require('es7frame/mq')) {}

module.exports = Mq;

require('../config');

Object.assign(Mq.desc, {
  type: 'mq',

  members: {
    auth: require('../../../sdk/auth/mq'),
    profiles: require('./users-profiles')
  },

  deps: {
    db: require('../db')
  },

  defaultInit: {
    connString: process.env.MQ_URI,
    prefix: process.env.MQ_PREFIX
  }
});
