const Union = require('es7frame/union');

class Db extends Union(require('es7frame/db')) {}

module.exports = Db;

require('../config');

Object.assign(Db.desc, {
  type: 'db',

  members: {
    keywords: require('../../../sdk/keywords/db'),
    profiles: require('./users-profiles'),
    users: require('./users'),
    validators: require('../../../sdk/validators/db')
  },

  deps: {
    mq: require('../mq')
  },

  defaultInit: {
    connString: process.env.AUTH_DB_URI,
    prefix: process.env.AUTH_DB_PREFIX
  }
});
